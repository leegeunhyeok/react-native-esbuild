import path from 'node:path';
import esbuild, {
  type BuildOptions,
  type BuildResult,
  type ServeResult,
} from 'esbuild';
import invariant from 'invariant';
import ora from 'ora';
import { isAvailable, isHMRBoundary } from '@react-native-esbuild/hmr';
import {
  Logger,
  LogLevel,
  setEnvironment,
  getIdByOptions,
  getDevServerPublicPath,
  combineWithDefaultBundleOptions,
  printLogo,
  printVersion,
  BuildMode,
  type Id,
  type BuildStatus,
  type BuildContext,
  type BuildStatusListener,
  type BundleOptions,
  type Config,
  type AdditionalData,
  type PluginFactory,
} from '@react-native-esbuild/shared';
import {
  getGlobalVariables,
  type ClientLogEvent,
} from '@react-native-esbuild/internal';
import {
  createBuildStatusPlugin,
  createBundleAnalyzePlugin,
} from '@react-native-esbuild/plugins';
import {
  HMRTransformer,
  getCommonReactNativeRuntimePipelineBuilder,
} from '@react-native-esbuild/transformer';
import { logger } from '../shared';
import {
  loadConfig,
  createBuildTaskDelegate,
  getConfigFromGlobal,
  getTransformedPreludeScript,
  getResolveExtensionsOption,
  getLoaderOption,
  getEsbuildWebConfig,
  getExternalFromPackageJson,
  getExternalModulePattern,
} from '../helpers';
import type {
  BundlerInitializeOptions,
  BundleResult,
  BundleRequestOptions,
  BuildTask,
  FileSystemWatchEventListener,
} from '../types';
import { FileSystemWatcher } from './watcher';
import { CacheStorage } from './cache';
import { ModuleManager } from './modules';
import { BundlerEventEmitter } from './events';
import { presets } from './plugins';

export class ReactNativeEsbuildBundler
  extends BundlerEventEmitter
  implements BuildStatusListener, FileSystemWatchEventListener
{
  private appLogger = new Logger('app', LogLevel.Trace);
  private buildTasks = new Map<Id, BuildTask>();
  private plugins: PluginFactory<unknown>[] = [];
  private watcher: FileSystemWatcher;
  private config: Config;
  private external: string[];
  private externalPattern: string;
  private initialized = false;

  /**
   * Must be bootstrapped first at the entry point
   */
  public static bootstrap(configFilePath?: string): void {
    // Skip printing the logo in the Jest worker process.
    if (process.env.JEST_WORKER_ID === undefined) {
      printLogo();
      printVersion();
    }

    const config = loadConfig(configFilePath);
    config.logger?.disabled ?? false ? Logger.disable() : Logger.enable();
    Logger.setTimestampFormat(config.logger?.timestamp ?? null);

    invariant(
      config.resolver?.mainFields,
      'resolver configuration is required',
    );
    invariant(config.transformer, 'transformer configuration is required');

    if (!config.resolver.mainFields.includes('react-native')) {
      logger.warn('`react-native` not found in `resolver.mainFields`');
    }

    if (!config.transformer.stripFlowPackageNames?.includes('react-native')) {
      logger.warn('`react-native` not found in `stripFlowPackageNames`');
    }
  }

  public static getConfig(): Config {
    return getConfigFromGlobal();
  }

  public static setGlobalLogLevel(logLevel: LogLevel): void {
    Logger.setGlobalLogLevel(logLevel);
  }

  public static async resetCache(): Promise<void> {
    await CacheStorage.clearAll();
    logger.info('transform cache was reset');
  }

  constructor(private root: string = process.cwd()) {
    super();
    this.config = getConfigFromGlobal();
    this.external = getExternalFromPackageJson(root);
    this.externalPattern = getExternalModulePattern(
      this.external,
      this.config.resolver?.assetExtensions ?? [],
    );
    this.on('report', (event) => {
      this.broadcastToReporter(event);
    });
  }

  private broadcastToReporter(event: ClientLogEvent): void {
    switch (event.type) {
      case 'client_log': {
        if (event.level === 'group' || event.level === 'groupCollapsed') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
          this.appLogger.group(...(event.data as unknown as any[]));
          return;
        } else if (event.level === 'groupEnd') {
          this.appLogger.groupEnd();
          return;
        }

        this.appLogger[event.level as keyof Logger](
          // @ts-expect-error this.appLogger[event.logger] is logger function
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allow any type.
          (event.data as any[]).join(' '),
        );
        break;
      }
    }
  }

  private async getBuildOptions(
    buildContext: BuildContext,
  ): Promise<BuildOptions> {
    const config = this.config;
    invariant(config.resolver, 'invalid resolver configuration');
    invariant(config.resolver.mainFields, 'invalid mainFields');
    invariant(config.transformer, 'invalid transformer configuration');
    invariant(config.resolver.assetExtensions, 'invalid assetExtensions');
    invariant(config.resolver.sourceExtensions, 'invalid sourceExtensions');
    setEnvironment(buildContext.bundleOptions.dev);

    const { mode, root, flags, bundleOptions } = buildContext;
    const { dev, entry, minify, outfile, platform } = bundleOptions;

    const webSpecifiedOptions =
      platform === 'web'
        ? getEsbuildWebConfig(mode, root, bundleOptions)
        : null;

    if (webSpecifiedOptions) {
      buildContext.bundleOptions.outfile =
        webSpecifiedOptions.outfile ?? path.basename(entry);
    }

    return {
      entryPoints: [entry],
      outfile,
      sourceRoot: root,
      mainFields: config.resolver.mainFields,
      resolveExtensions: getResolveExtensionsOption(
        bundleOptions,
        config.resolver.sourceExtensions,
        config.resolver.assetExtensions,
      ),
      loader: getLoaderOption(config.resolver.assetExtensions),
      define: getGlobalVariables(dev, platform),
      banner: {
        js: await getTransformedPreludeScript(
          bundleOptions,
          root,
          [
            flags.hmrEnabled ? 'swc-plugin-global-module/runtime' : undefined,
          ].filter(Boolean) as string[],
        ),
      },
      plugins: [
        // Common plugins
        createBuildStatusPlugin(buildContext, { handler: this }),
        createBundleAnalyzePlugin(buildContext),
        // Added plugin creators
        ...(platform === 'web' ? presets.web : presets.native).map(
          (createPlugin) => createPlugin(buildContext),
        ),
        ...this.plugins.map((plugin) => plugin(buildContext)),
        // Additional plugins in configuration.
        ...(config.plugins ?? []),
      ],
      legalComments: 'none',
      target: 'es6',
      format: 'esm',
      supported: {
        /**
         * To avoid block scope bug on hermes engine.
         *
         * If set `for-of` flag to `false`(unsupported),
         * injected `__copyProps` by esbuild will be not use `let` keyword.
         *
         * @see hermes {@link https://github.com/facebook/hermes/issues/575}
         * @see esbuild {@link https://github.com/evanw/esbuild/blob/v0.19.5/internal/runtime/runtime.go#L199-L213}
         */
        'for-of': false,
      },
      logLevel: 'silent',
      bundle: true,
      sourcemap: true,
      metafile: true,
      minify,
      write: mode === BuildMode.Bundle,
      ...webSpecifiedOptions,
    };
  }

  private throwIfNotInitialized(): void {
    if (this.initialized) return;
    throw new Error('bundler not initialized');
  }

  private createContext(
    mode: BuildMode,
    bundleOptions: BundleOptions,
    additionalData?: AdditionalData,
  ): BuildContext {
    const root = this.root;
    const config = this.config;
    const cacheEnabled = Boolean(config.cache);
    const hmrEnabled = Boolean(
      isAvailable(mode, bundleOptions) && config.experimental?.hmr,
    );

    const pipeline = getCommonReactNativeRuntimePipelineBuilder(
      root,
      config,
      bundleOptions,
      { hmrEnabled },
    ).build();

    const context: BuildContext = {
      mode,
      id: getIdByOptions(bundleOptions),
      root,
      config,
      bundleOptions,
      transformer: async (code, context) => {
        return (await pipeline.transform(code, context)).code;
      },
      flags: {
        cacheEnabled,
        hmrEnabled,
      },
      moduleManager: new ModuleManager(root),
      cacheStorage: new CacheStorage(),
      additionalData: additionalData ?? {},
    };

    return context;
  }

  private async setupTask(
    bundleOptions: BundleOptions,
    additionalData?: AdditionalData,
  ): Promise<BuildTask> {
    const id = getIdByOptions(bundleOptions);
    if (this.buildTasks.has(id)) {
      return this.buildTasks.get(id)!;
    }

    const context = this.createContext(
      BuildMode.Watch,
      bundleOptions,
      additionalData,
    );

    const buildOptions = await this.getBuildOptions(context);
    const buildTask: BuildTask = {
      context,
      esbuild: await esbuild.context(buildOptions),
      delegate: createBuildTaskDelegate(),
      buildCount: 0,
      status: 'pending',
    };

    this.buildTasks.set(id, buildTask);
    logger.debug(`new build context registered (id: ${id})`);

    return buildTask;
  }

  private resetTask(context: BuildContext): void {
    // Skip when bundle mode because task does not exist in this mode.
    if (context.mode === BuildMode.Bundle) return;

    const buildTask = this.buildTasks.get(context.id);
    invariant(buildTask, 'no build task');

    if (buildTask.buildCount === 0) return;

    logger.debug(`reset build context (id: ${context.id})`, {
      buildCount: buildTask.buildCount,
    });

    buildTask.delegate = createBuildTaskDelegate();
    buildTask.status = 'pending';
    buildTask.buildCount += 1;
  }

  public onBuildStart(context: BuildContext): void {
    this.resetTask(context);
    this.emit('build-start', { id: context.id });
  }

  public onBuild(context: BuildContext, status: BuildStatus): void {
    this.emit('build-status-change', { id: context.id, ...status });
  }

  public onBuildEnd(
    context: BuildContext,
    data: { result: BuildResult; success: boolean },
  ): void {
    /**
     * Exit at the end of a build in bundle mode.
     *
     * If the build fails, exit with status 1.
     */
    if (context.mode === BuildMode.Bundle) {
      if (data.success) return;
      process.exit(1);
    }

    invariant(data.success, 'build failed');
    invariant(data.result.metafile, 'invalid metafile');
    invariant(data.result.outputFiles, 'empty outputFiles');

    const buildTask = this.buildTasks.get(context.id);
    invariant(buildTask, 'no build task');

    const bundleEndedAt = new Date();
    const bundleFilename = context.bundleOptions.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const revisionId = bundleEndedAt.getTime().toString();
    const { outputFiles, metafile } = data.result;

    buildTask.context.moduleManager.initializeDependencyGraph(
      metafile,
      context.bundleOptions.entry,
    );

    const findFromOutputFile = (
      filename: string,
    ): (<T extends { path: string }>(args: T) => boolean) => {
      return <T extends { path: string }>({ path }: T) =>
        path.endsWith(filename);
    };

    try {
      const bundleOutput = outputFiles.find(findFromOutputFile(bundleFilename));
      const bundleSourcemapOutput = outputFiles.find(
        findFromOutputFile(bundleSourcemapFilename),
      );
      invariant(bundleOutput, 'empty bundle output');
      invariant(bundleSourcemapOutput, 'empty sourcemap output');

      buildTask.delegate.success({
        result: {
          source: bundleOutput.contents,
          sourcemap: bundleSourcemapOutput.contents,
          bundledAt: bundleEndedAt,
          revisionId,
        },
        error: null,
      });
    } catch (error) {
      buildTask.delegate.failure(error);
    } finally {
      buildTask.status = 'resolved';
      this.emit('build-end', {
        revisionId,
        id: context.id,
        additionalData: context.additionalData,
        update: null,
      });
    }
  }

  public onFileSystemChange(event: string, path: string): void {
    const hasBuildTask = this.buildTasks.size > 0;
    const isChanged = event === 'change';

    if (!(hasBuildTask && isChanged)) return;

    // Set status as stale (need to rebuild when receive bundle requests)
    this.buildTasks.forEach((task) => (task.status = 'pending'));

    if (this.config.experimental?.hmr && isHMRBoundary(path)) {
      this.buildTasks.forEach((task) => {
        const buildContext = task.context;
        const moduleId = buildContext.moduleManager.getModuleId(path);
        HMRTransformer.transformDelta(buildContext, moduleId).then((result) => {
          this.emit('build-end', {
            id: moduleId,
            update: result,
            revisionId: new Date().getTime().toString(),
          });
        });
      });
    } else {
      this.buildTasks.forEach(({ esbuild }) => {
        esbuild.rebuild();
      });
    }
  }

  public async initialize(options?: BundlerInitializeOptions): Promise<this> {
    if (this.initialized) {
      logger.warn('bundler already initialized');
      return this;
    }

    // Initialize.
    const spinner = ora({ discardStdin: false }).start(
      'Bundler initializing...',
    );

    if (options?.watcherEnabled) {
      this.watcher = new FileSystemWatcher(this);
      await this.watcher.watch(this.root);
    }

    this.initialized = true;
    spinner.stop();

    // Post initialize.
    if (self.shouldResetCache) {
      await ReactNativeEsbuildBundler.resetCache();
    }

    return this;
  }

  public addPlugin(creator: PluginFactory<unknown>): this {
    this.plugins.push(creator);
    return this;
  }

  public async bundle(
    bundleOptions: Partial<BundleOptions>,
    additionalData?: AdditionalData,
  ): Promise<BuildResult> {
    this.throwIfNotInitialized();

    const context = this.createContext(
      BuildMode.Bundle,
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );

    const buildOptions = await this.getBuildOptions(context);

    return esbuild.build(buildOptions);
  }

  public async serve(
    bundleOptions: Partial<BundleOptions>,
    additionalData?: AdditionalData,
  ): Promise<ServeResult> {
    this.throwIfNotInitialized();
    if (bundleOptions.platform !== 'web') {
      throw new Error('serve mode is only available on web platform');
    }

    const postProcessedBundleOptions =
      combineWithDefaultBundleOptions(bundleOptions);

    const buildTask = await this.setupTask(
      postProcessedBundleOptions,
      additionalData,
    );

    if (buildTask.status === 'pending') {
      buildTask.esbuild.rebuild();
    }

    return buildTask.esbuild.serve({
      servedir: getDevServerPublicPath(this.root),
    });
  }

  public async getBundleResult(
    bundleOptions: BundleRequestOptions,
    additionalData?: AdditionalData,
  ): Promise<BundleResult> {
    this.throwIfNotInitialized();

    const postProcessedBundleOptions =
      combineWithDefaultBundleOptions(bundleOptions);

    const buildTask = await this.setupTask(
      postProcessedBundleOptions,
      additionalData,
    );

    if (buildTask.status === 'pending') {
      buildTask.esbuild.rebuild();
    }

    const result = await buildTask.delegate.promise;

    return result;
  }

  public getRoot(): string {
    return this.root;
  }
}
