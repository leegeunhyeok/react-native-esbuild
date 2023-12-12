import path from 'node:path';
import os from 'node:os';
import esbuild, {
  type BuildOptions,
  type BuildResult,
  type ServeResult,
} from 'esbuild';
import invariant from 'invariant';
import ora from 'ora';
import { isHMRBoundary } from '@react-native-esbuild/hmr';
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
  createMetafilePlugin,
} from '@react-native-esbuild/plugins';
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
    mode: BuildMode,
    bundleOptions: BundleOptions,
    additionalData?: AdditionalData,
  ): Promise<BuildOptions> {
    const config = this.config;
    invariant(config.resolver, 'invalid resolver configuration');
    invariant(config.resolver.mainFields, 'invalid mainFields');
    invariant(config.transformer, 'invalid transformer configuration');
    invariant(config.resolver.assetExtensions, 'invalid assetExtensions');
    invariant(config.resolver.sourceExtensions, 'invalid sourceExtensions');

    setEnvironment(bundleOptions.dev);

    const hmrEnabled = Boolean(
      mode === BuildMode.Watch && bundleOptions.dev && config.experimental?.hmr,
    );
    const webSpecifiedOptions =
      bundleOptions.platform === 'web'
        ? getEsbuildWebConfig(mode, this.root, bundleOptions)
        : null;

    if (webSpecifiedOptions) {
      bundleOptions.outfile =
        webSpecifiedOptions.outfile ?? path.basename(bundleOptions.entry);
    }

    const context: BuildContext = {
      id: getIdByOptions(bundleOptions),
      root: this.root,
      config: this.config,
      bundleOptions,
      mode,
      moduleManager: new ModuleManager(),
      cacheStorage: new CacheStorage(),
      hmrEnabled,
      additionalData: {
        ...additionalData,
        externalPattern: this.externalPattern,
      },
    };

    return {
      entryPoints: [bundleOptions.entry],
      outfile: bundleOptions.outfile,
      sourceRoot: this.root,
      mainFields: config.resolver.mainFields,
      resolveExtensions: getResolveExtensionsOption(
        bundleOptions,
        config.resolver.sourceExtensions,
        config.resolver.assetExtensions,
      ),
      loader: getLoaderOption(config.resolver.assetExtensions),
      define: getGlobalVariables(bundleOptions.dev, bundleOptions.platform),
      banner: {
        js: await getTransformedPreludeScript(
          bundleOptions,
          this.root,
          [hmrEnabled ? 'swc-plugin-global-module/runtime' : undefined].filter(
            Boolean,
          ) as string[],
        ),
      },
      plugins: [
        // Common plugins
        createBuildStatusPlugin(context, {}),
        createMetafilePlugin(context),
        // Added plugin creators
        ...(bundleOptions.platform === 'web'
          ? presets.web
          : presets.native
        ).map((createPlugin) => createPlugin(context)),
        ...this.plugins.map((plugin) => plugin(context)),
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
      minify: bundleOptions.minify,
      write: mode === BuildMode.Bundle,
      ...webSpecifiedOptions,
    };
  }

  private throwIfNotInitialized(): void {
    if (this.initialized) return;
    throw new Error('bundler not initialized');
  }

  private async setupTask(
    bundleOptions: BundleOptions,
    additionalData?: AdditionalData,
  ): Promise<BuildTask> {
    const id = getIdByOptions(bundleOptions);
    if (this.buildTasks.has(id)) {
      return this.buildTasks.get(id)!;
    }

    const buildOptions = await this.getBuildOptions(
      BuildMode.Watch,
      bundleOptions,
      additionalData,
    );

    const buildTask: BuildTask = {
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

    const buildContext = this.buildTasks.get(context.id);
    invariant(buildContext, 'no build context');

    if (buildContext.buildCount === 0) return;

    logger.debug(`reset build context (id: ${context.id})`, {
      buildCount: buildContext.buildCount,
    });

    buildContext.delegate = createBuildTaskDelegate();
    buildContext.status = 'pending';
    buildContext.buildCount += 1;
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

    const buildContext = this.buildTasks.get(context.id);
    invariant(buildContext, 'no build context');

    // if (context.hmrEnabled) {
    //   ReactNativeEsbuildBundler.sharedData.get(context.id).set({
    //     dependencyGraph: generateDependencyGraph(
    //       data.result.metafile,
    //       context.bundleOptions.entry,
    //     ),
    //   });
    // }

    const bundleEndedAt = new Date();
    const bundleFilename = context.bundleOptions.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const revisionId = bundleEndedAt.getTime().toString();
    const { outputFiles } = data.result;

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

      buildContext.delegate.success({
        result: {
          source: bundleOutput.contents,
          sourcemap: bundleSourcemapOutput.contents,
          bundledAt: bundleEndedAt,
          revisionId,
        },
        error: null,
      });
    } catch (error) {
      buildContext.delegate.failure(error);
    } finally {
      buildContext.status = 'resolved';
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
      // for (const [
      //   id,
      //   hmrController,
      // ] of ReactNativeEsbuildBundler.hmr.entries()) {
      //   hmrController.getDelta(changedFile).then((update) => {
      //     this.emit('build-end', {
      //       id,
      //       update,
      //       revisionId: new Date().getTime().toString(),
      //     });
      //   });
      // }
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
    const buildOptions = await this.getBuildOptions(
      BuildMode.Bundle,
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );
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

    const buildContext = await this.setupTask(
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );

    if (buildContext.status === 'pending') {
      buildContext.esbuild.rebuild();
    }

    return buildContext.esbuild.serve({
      servedir: getDevServerPublicPath(this.root),
    });
  }

  public async getBundleResult(
    bundleOptions: BundleRequestOptions,
    additionalData?: AdditionalData,
  ): Promise<BundleResult> {
    this.throwIfNotInitialized();
    const buildContext = await this.setupTask(
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );

    if (buildContext.status === 'pending') {
      buildContext.esbuild.rebuild();
    }

    const result = await buildContext.delegate.promise;

    return result;
  }

  public getRoot(): string {
    return this.root;
  }
}
