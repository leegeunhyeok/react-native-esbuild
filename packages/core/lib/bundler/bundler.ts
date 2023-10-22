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
import { CacheStorage } from '../cache';
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
  PromiseHandler,
  EsbuildPluginFactory,
  PluginContext,
  ReportableEvent,
  BundlerSharedData,
} from '../types';
import {
  loadConfig,
  getConfigFromGlobal,
  createPromiseHandler,
  getTransformedPreludeScript,
  getResolveExtensionsOption,
  getLoaderOption,
  getEsbuildWebConfig,
} from './helpers';
import { BundlerEventEmitter } from './events';
import { createBuildStatusPlugin, createMetafilePlugin } from './plugins';
import {
  ReactNativeEsbuildError,
  ReactNativeEsbuildErrorCode as ErrorCode,
} from './errors';
import { printLogo, printVersion } from './logo';

export class ReactNativeEsbuildBundler extends BundlerEventEmitter {
  public static caches = CacheStorage.getInstance();
  public static shared: BundlerSharedData = {
    watcher: {
      changed: null,
    },
  };
  private initialized = false;
  private config: Config;
  private appLogger = new Logger('app', LogLevel.Trace);
  private buildTasks = new Map<number, BuildTask>();
  private plugins: ReturnType<EsbuildPluginFactory<unknown>>[] = [];

  /**
   * must be bootstrapped first at the entry point
   */
  public static bootstrap(configFilePath?: string): void {
    printLogo();
    printVersion();
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- allow any
          this.appLogger.group(...(event.data as any[]));
          return;
        } else if (event.level === 'groupEnd') {
          this.appLogger.groupEnd();
          return;
        }

        this.appLogger[event.level as keyof Logger](
          // @ts-expect-error this.appLogger[event.logger] is logger function
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
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
        if (this.buildTasks.size > 0 && event === 'change') {
          ReactNativeEsbuildBundler.shared.watcher = {
            changed: changedFile,
            stats,
          };
        } else {
          ReactNativeEsbuildBundler.shared.watcher = {
            changed: null,
            stats: undefined,
          };
        }

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

    const plugins = [
      /**
       * `build-status-plugin` is required and must be placed first
       */
      createBuildStatusPlugin({
        onStart: (context) => {
          this.handleBuildStart(context);
        },
        onUpdate: (buildState, context) => {
          this.handleBuildStateUpdate(buildState, context);
        },
        onEnd: (result, context) => {
          this.handleBuildEnd(result, context);
        },
      }),
      createMetafilePlugin(),
      ...this.plugins,
    ];

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
        // plugin factories
        ...plugins.map((plugin) => plugin(context)),
        // additional plugins from configuration
        ...(config.plugins ?? []),
      ],
      legalComments: bundleOptions.dev ? 'inline' : 'none',
      target: 'es6',
      format: 'esm',
      supported: {
        /**
         * to avoid block scope bug on hermes engine.
         * in `__copyProps`, generated by esbuild
         *
         * @see {@link https://github.com/evanw/esbuild/blob/v0.18.17/internal/runtime/runtime.go#L192}
         */
        'for-of': false,
      },
      bundle: true,
      sourcemap: true,
      minify: bundleOptions.minify,
      metafile: bundleOptions.metafile,
      logLevel: 'silent',
      write: mode === 'bundle',
      ...webSpecifiedOptions,
    };
  }

  private identifyTaskByBundleOptions(bundleOptions: BundleOptions): number {
    return getIdByOptions(bundleOptions);
  }

  private throwIfNotInitialized(): void {
    if (this.initialized) return;

    throw new ReactNativeEsbuildError(
      'bundler not initialized',
      ErrorCode.NotInitialized,
    );
  }

  private assertBuildTask(task?: BuildTask): asserts task is BuildTask {
    if (task) return;
    throw new ReactNativeEsbuildError(
      'unable to get build task',
      ErrorCode.InvalidTask,
    );
  }

  private assertTaskHandler(
    handler?: PromiseHandler<BundleResult> | null,
  ): asserts handler is PromiseHandler<BundleResult> {
    if (handler) return;
    throw new ReactNativeEsbuildError(
      'invalid task handler',
      ErrorCode.InvalidTask,
    );
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
    // exit at the end of a build in bundle mode.
    // if the build fails, exit to state 1.
    if (context.mode === 'bundle') {
      if (data.success) return;
      process.exit(1);
    }
    const bundleEndedAt = new Date();
    const bundleFilename = context.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const revisionId = bundleEndedAt.getTime().toString();
    const { outputFiles } = data.result;

    const currentTask = this.buildTasks.get(context.id);
    this.assertBuildTask(currentTask);

    const findFromOutputFile = (
      filename: string,
    ): (<T extends { path: string }>(args: T) => boolean) => {
      return <T extends { path: string }>({ path }: T) =>
        path.endsWith(filename);
    };

    try {
      if (!data.success) {
        throw new ReactNativeEsbuildError(
          'build failed',
          ErrorCode.BuildFailure,
        );
      }

      // `outputFiles` available when only `write: false`
      if (outputFiles === undefined) {
        throw new ReactNativeEsbuildError('outputFiles is empty');
      }

      const bundleOutput = outputFiles.find(findFromOutputFile(bundleFilename));
      const bundleSourcemapOutput = outputFiles.find(
        findFromOutputFile(bundleSourcemapFilename),
      );

      if (!(bundleOutput && bundleSourcemapOutput)) {
        throw new ReactNativeEsbuildError('empty bundle result');
      }

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
      // trigger first build
      context.rebuild().catch((error) => handler.rejecter?.(error));
      logger.debug(`bundle task is now watching (id: ${targetTaskId})`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- set() if not exist
    return this.buildTasks.get(targetTaskId)!;
  }

  private resetTask(context: PluginContext): void {
    // task does not exist in bundle mode
    if (context.mode === 'bundle') return;

    const buildTaskId = context.id;
    const targetTask = this.buildTasks.get(buildTaskId);
    this.assertBuildTask(targetTask);
    logger.debug(`reset task (id: ${buildTaskId})`, {
      buildCount: targetTask.buildCount,
    });

    this.buildTasks.set(buildTaskId, {
      // keep previous esbuild context
      context: targetTask.context,
      // set status to pending and using new promise instance only when stale
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
    const spinner = ora({ discardStdin: false }).start(
      'Bundler initializing...',
    );

    if (options?.watcherEnabled) {
      await this.startWatcher();
    }

    this.initialized = true;
    spinner.stop();

    return this;
  }

  public registerPlugin(
    plugin: ReturnType<EsbuildPluginFactory<unknown>>,
  ): this {
    this.plugins.push(plugin);
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
      throw new ReactNativeEsbuildError(
        'serve mode is only available on web platform',
      );
    }

    const buildTask = await this.getOrCreateBundleTask(
      combineWithDefaultBundleOptions(bundleOptions),
      additionalData,
    );
    this.assertTaskHandler(buildTask.handler);

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
    this.assertTaskHandler(buildTask.handler);
    return buildTask.handler.task;
  }

  public getConfig(): Config {
    return this.config;
  }

  public getRoot(): string {
    return this.root;
  }
}
