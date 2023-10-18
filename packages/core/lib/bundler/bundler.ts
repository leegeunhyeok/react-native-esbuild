import path from 'node:path';
import esbuild, {
  type BuildOptions,
  type BuildResult,
  type ServeResult,
} from 'esbuild';
import invariant from 'invariant';
import ora from 'ora';
import { getGlobalVariables } from '@react-native-esbuild/internal';
import {
  setEnvironment,
  combineWithDefaultBundleOptions,
  getIdByOptions,
  getDevServerPublicPath,
  type BundleOptions,
} from '@react-native-esbuild/config';
import { Logger, LogLevel } from '@react-native-esbuild/utils';
import { FileSystemWatcher } from '../watcher';
import { logger } from '../shared';
import type {
  Config,
  BundlerInitializeOptions,
  BuildTask,
  BuildStatus,
  BundleMode,
  BundlerAdditionalData,
  BundleResult,
  BundleRequestOptions,
  PluginContext,
  UpdatedModule,
  ReportableEvent,
  ReactNativeEsbuildPluginCreator,
} from '../types';
import { CacheStorage, SharedStorage } from './storages';
import { createBuildStatusPlugin, createMetafilePlugin } from './plugins';
import { BundlerEventEmitter } from './events';
import {
  loadConfig,
  createPromiseHandler,
  getConfigFromGlobal,
  getTransformedPreludeScript,
  getResolveExtensionsOption,
  getLoaderOption,
  getEsbuildWebConfig,
  getHmrUpdatedModule,
} from './helpers';
import { printLogo, printVersion } from './logo';

export class ReactNativeEsbuildBundler extends BundlerEventEmitter {
  public static caches = CacheStorage.getInstance();
  public static shared = SharedStorage.getInstance();
  private appLogger = new Logger('app', LogLevel.Trace);
  private buildTasks = new Map<number, BuildTask>();
  private plugins: ReactNativeEsbuildPluginCreator<unknown>[] = [];
  private initialized = false;
  private config: Config;

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
    await ReactNativeEsbuildBundler.caches.clearAll();
    logger.info('transform cache was reset');
  }

  constructor(private root: string = process.cwd()) {
    super();
    this.config = getConfigFromGlobal();
    this.on('report', (event) => {
      this.broadcastToReporter(event);
    });
  }

  private broadcastToReporter(event: ReportableEvent): void {
    // default reporter (for logging)
    switch (event.type) {
      case 'client_log': {
        if (event.level === 'group' || event.level === 'groupCollapsed') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Allow any type.
          this.appLogger.group(...(event.data as any[]));
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

    // send event to custom reporter
    this.config.reporter?.(event);
  }

  private startWatcher(): Promise<void> {
    return FileSystemWatcher.getInstance()
      .setHandler((event, changedFile, stats) => {
        const hasTask = this.buildTasks.size > 0;
        const isChanged = event === 'change';
        ReactNativeEsbuildBundler.shared.setValue({
          watcher: {
            changed: hasTask && isChanged ? changedFile : null,
            stats: stats ?? null,
          },
        });

        for (const { context, handler } of this.buildTasks.values()) {
          context.rebuild().catch((error) => handler?.rejecter?.(error));
        }
      })
      .watch(this.root);
  }

  private async getBuildOptionsForBundler(
    mode: BundleMode,
    bundleOptions: BundleOptions,
    additionalData?: BundlerAdditionalData,
  ): Promise<BuildOptions> {
    const config = this.config;
    const enableHmr = bundleOptions.dev && !bundleOptions.minify;
    invariant(config.resolver, 'invalid resolver configuration');
    invariant(config.resolver.mainFields, 'invalid mainFields');
    invariant(config.transformer, 'invalid transformer configuration');
    invariant(config.resolver.assetExtensions, 'invalid assetExtension');
    invariant(config.resolver.sourceExtensions, 'invalid sourceExtensions');
    setEnvironment(bundleOptions.dev);

    const webSpecifiedOptions =
      bundleOptions.platform === 'web'
        ? getEsbuildWebConfig(mode, this.root, bundleOptions)
        : null;

    if (webSpecifiedOptions) {
      bundleOptions.outfile =
        webSpecifiedOptions.outfile ?? path.basename(bundleOptions.entry);
    }

    const context: PluginContext = {
      ...bundleOptions,
      id: this.identifyTaskByBundleOptions(bundleOptions),
      root: this.root,
      config: this.config,
      mode,
      additionalData,
    };

    return {
      entryPoints: [bundleOptions.entry],
      outfile: bundleOptions.outfile,
      sourceRoot: path.dirname(bundleOptions.entry),
      mainFields: config.resolver.mainFields,
      resolveExtensions: getResolveExtensionsOption(
        bundleOptions,
        config.resolver.sourceExtensions,
        config.resolver.assetExtensions,
      ),
      loader: getLoaderOption(config.resolver.assetExtensions),
      define: getGlobalVariables(bundleOptions),
      banner: {
        js: await getTransformedPreludeScript(bundleOptions, this.root),
      },
      plugins: [
        createBuildStatusPlugin(context, {
          onStart: this.handleBuildStart.bind(this),
          onUpdate: this.handleBuildStateUpdate.bind(this),
          onEnd: this.handleBuildEnd.bind(this),
        }),
        createMetafilePlugin(context),
        // Added plugin creators.
        ...this.plugins.map((plugin) => plugin(context)),
        // Additional plugins in configuration.
        ...(config.plugins ?? []),
      ],
      legalComments: enableHmr ? 'inline' : 'none',
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
      minify: bundleOptions.minify,
      metafile: bundleOptions.metafile,
      write: mode === 'bundle',
      ...webSpecifiedOptions,
    };
  }

  private identifyTaskByBundleOptions(bundleOptions: BundleOptions): number {
    return getIdByOptions(bundleOptions);
  }

  private throwIfNotInitialized(): void {
    if (this.initialized) return;
    throw new Error('bundler not initialized');
  }

  private handleBuildStart(context: PluginContext): void {
    this.resetTask(context);
    this.emit('build-start', { id: context.id });
  }

  private handleBuildStateUpdate(
    buildState: BuildStatus,
    context: PluginContext,
  ): void {
    this.emit('build-status-change', { id: context.id, ...buildState });
  }

  private handleBuildEnd(
    data: { result: BuildResult; success: boolean },
    context: PluginContext,
  ): void {
    /**
     * Exit at the end of a build in bundle mode.
     *
     * If the build fails, exit with status 1.
     */
    if (context.mode === 'bundle') {
      if (data.success) return;
      process.exit(1);
    }

    const hmrSharedValue = ReactNativeEsbuildBundler.shared.get(context.id);
    const currentTask = this.buildTasks.get(context.id);
    invariant(hmrSharedValue, 'invalid hmr shared value');
    invariant(currentTask, 'no task');

    const bundleEndedAt = new Date();
    const bundleFilename = context.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const revisionId = bundleEndedAt.getTime().toString();
    const { outputFiles } = data.result;
    let updatedModule: UpdatedModule | null = null;

    const findFromOutputFile = (
      filename: string,
    ): (<T extends { path: string }>(args: T) => boolean) => {
      return <T extends { path: string }>({ path }: T) =>
        path.endsWith(filename);
    };

    try {
      invariant(data.success, 'build failed');
      invariant(outputFiles, 'empty outputFiles');

      const bundleOutput = outputFiles.find(findFromOutputFile(bundleFilename));
      const bundleSourcemapOutput = outputFiles.find(
        findFromOutputFile(bundleSourcemapFilename),
      );
      invariant(bundleOutput, 'empty bundle output');
      invariant(bundleSourcemapOutput, 'empty sourcemap output');

      updatedModule = getHmrUpdatedModule(
        hmrSharedValue.hmr.id,
        hmrSharedValue.hmr.path,
        bundleOutput.text,
      );

      currentTask.handler?.resolver?.({
        result: {
          source: bundleOutput.contents,
          sourcemap: bundleSourcemapOutput.contents,
          bundledAt: bundleEndedAt,
          revisionId,
        },
        error: null,
      });
    } catch (error) {
      currentTask.handler?.rejecter?.(error);
    } finally {
      currentTask.status = 'resolved';
      this.emit('build-end', {
        revisionId,
        id: context.id,
        additionalData: context.additionalData,
        updatedModule,
      });
    }
  }

  private async getOrCreateBundleTask(
    bundleOptions: BundleOptions,
    additionalData?: BundlerAdditionalData,
  ): Promise<BuildTask> {
    const targetTaskId = this.identifyTaskByBundleOptions(bundleOptions);

    if (!this.buildTasks.has(targetTaskId)) {
      logger.debug(`bundle task not registered (id: ${targetTaskId})`);
      const buildOptions = await this.getBuildOptionsForBundler(
        'watch',
        bundleOptions,
        additionalData,
      );
      const handler = createPromiseHandler();
      const context = await esbuild.context(buildOptions);
      this.buildTasks.set(targetTaskId, {
        context,
        handler,
        status: 'pending',
        buildCount: 0,
      });
      // Trigger first build.
      context.rebuild().catch((error) => handler.rejecter?.(error));
      logger.debug(`bundle task is now watching (id: ${targetTaskId})`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Already `set()` if not exist.
    return this.buildTasks.get(targetTaskId)!;
  }

  private resetTask(context: PluginContext): void {
    // Skip when bundle mode because task does not exist in this mode.
    if (context.mode === 'bundle') return;

    const targetTask = this.buildTasks.get(context.id);
    invariant(targetTask, 'no task');

    logger.debug(`reset task (id: ${context.id})`, {
      buildCount: targetTask.buildCount,
    });

    this.buildTasks.set(context.id, {
      // Use created esbuild context.
      context: targetTask.context,
      /**
       * Set status to `pending` and create new handler when it is stale.
       *
       * - `buildCount` is 0, it is first build.
       * - `buildCount` is over 0, triggered rebuild (handler is stale).
       */
      handler:
        targetTask.buildCount === 0
          ? targetTask.handler
          : createPromiseHandler(),
      status: 'pending',
      buildCount: targetTask.buildCount + 1,
    });
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
      await this.startWatcher();
    }

    this.initialized = true;
    spinner.stop();

    // Post initialize.
    if (self.shouldResetCache) {
      await ReactNativeEsbuildBundler.resetCache();
    }

    return this;
  }

  public addPlugin(creator: ReactNativeEsbuildPluginCreator<unknown>): this {
    this.plugins.push(creator);
    return this;
  }

  public async bundle(
    bundleOptions: Partial<BundleOptions>,
    additionalData?: BundlerAdditionalData,
  ): Promise<BuildResult> {
    this.throwIfNotInitialized();
    const buildOptions = await this.getBuildOptionsForBundler(
      'bundle',
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );
    return esbuild.build(buildOptions);
  }

  public async serve(
    bundleOptions: Partial<BundleOptions>,
    additionalData?: BundlerAdditionalData,
  ): Promise<ServeResult> {
    this.throwIfNotInitialized();
    if (bundleOptions.platform !== 'web') {
      throw new Error('serve mode is only available on web platform');
    }

    const buildTask = await this.getOrCreateBundleTask(
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );
    invariant(buildTask.handler, 'no handler');

    return buildTask.context.serve({
      servedir: getDevServerPublicPath(this.root),
    });
  }

  public async getBundleResult(
    bundleOptions: BundleRequestOptions,
    additionalData?: BundlerAdditionalData,
  ): Promise<BundleResult> {
    this.throwIfNotInitialized();
    const buildTask = await this.getOrCreateBundleTask(
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );
    invariant(buildTask.handler, 'no handler');

    return buildTask.handler.task;
  }

  public getRoot(): string {
    return this.root;
  }
}
