import EventEmitter from 'node:events';
import esbuild, {
  type BuildOptions,
  type BuildResult,
  type BuildContext,
} from 'esbuild';
import {
  loadConfig,
  getEsbuildOptions,
  type ReactNativeEsbuildConfig,
} from '@react-native-esbuild/config';
import { colors, isCI } from '@react-native-esbuild/utils';
import { CacheStorage } from '../cache';
import { createPromiseHandler } from '../helpers';
import { logger } from '../shared';
import { BundleTaskSignal } from '../types';
import type {
  BundleConfig,
  BundleResult,
  BundleRequestOptions,
  EsbuildPluginFactory,
  PluginContext,
  PromiseHandler,
} from '../types';
import { createBuildStatusPlugin } from './internal';
import { printLogo } from './logo';

export class ReactNativeEsbuildBundler extends EventEmitter {
  public static caches = CacheStorage.getInstance();
  private config: ReactNativeEsbuildConfig;
  private plugins: ReturnType<EsbuildPluginFactory<unknown>>[];
  private esbuildContext?: BuildContext;
  private esbuildTaskHandler?: PromiseHandler<BundleResult>;
  private bundleResult?: BundleResult;

  constructor() {
    super();
    if (isCI()) colors.disable();
    printLogo();
    this.config = loadConfig();
  }

  private getBuildOptionsForBundler(
    bundleConfig: BundleConfig,
    mode: 'bundle' | 'watch',
  ): BuildOptions {
    if (!this.plugins.length) {
      throw new Error('plugins is not registered');
    }

    const context: PluginContext = {
      ...bundleConfig,
      config: this.config,
    };

    const plugins = [
      /**
       * `build-status-plugin` is required and must be placed first
       */
      createBuildStatusPlugin({
        onStart: (context) => this.handleBuildStart(context),
        onEnd: (result, context) => this.handleBuildEnd(result, context),
      }),
      ...this.plugins,
    ];

    return getEsbuildOptions(bundleConfig, {
      plugins: plugins.map((plugin) => plugin(context)),
      write: mode === 'bundle',
    });
  }

  private handleBuildStart(_context: PluginContext): void {
    this.esbuildTaskHandler?.rejecter?.(BundleTaskSignal.Cancelled);
    this.esbuildTaskHandler = createPromiseHandler();
    this.emit('build-start');
  }

  private handleBuildEnd(result: BuildResult, context: PluginContext): void {
    const isInitialBuild = !this.bundleResult;
    const bundleFilename = context.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const { outputFiles } = result;

    // `outputFiles` available when only `write: false`
    if (outputFiles === undefined) return;

    logger.info('preparing bundled result');

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

      if (!(bundleOutput && bundleSourcemapOutput)) {
        logger.warn('cannot found bundle and sourcemap');
        this.esbuildTaskHandler?.rejecter?.(BundleTaskSignal.EmptyOutput);
        return;
      }

      this.bundleResult = {
        source: bundleOutput.contents,
        sourcemap: bundleSourcemapOutput.contents,
      };

      this.esbuildTaskHandler?.resolver?.(this.bundleResult);
    } catch (error) {
      this.esbuildTaskHandler?.rejecter?.(error);
    } finally {
      if (!isInitialBuild) {
        this.emit('build-end');
      }
    }
  }

  private assertTaskHandler(
    handler?: PromiseHandler<BundleResult>,
  ): asserts handler is PromiseHandler<BundleResult> {
    if (
      !(
        handler &&
        typeof handler.rejecter === 'function' &&
        typeof handler.resolver === 'function' &&
        typeof handler.task.then === 'function'
      )
    ) {
      throw BundleTaskSignal.WatchModeNotStarted;
    }
  }

  registerPlugin(plugin: ReturnType<EsbuildPluginFactory<unknown>>): this {
    this.plugins.push(plugin);
    return this;
  }

  getContext(): BuildContext | null {
    if (this.esbuildContext) {
      return this.esbuildContext;
    }
    logger.warn('esbuild context is empty');
    return null;
  }

  async bundle(bundleConfig: BundleConfig): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler(bundleConfig, 'bundle');
    logger.debug('preparing bundle mode', { platform: bundleConfig.platform });
    logger.debug('esbuild option', buildOptions);
    return esbuild.build(buildOptions);
  }

  async watch(bundleConfig: BundleConfig): Promise<void> {
    const buildOptions = this.getBuildOptionsForBundler(bundleConfig, 'watch');
    logger.debug('preparing watch mode', { platform: bundleConfig.platform });
    logger.debug('esbuild option', buildOptions);
    (this.esbuildContext = await esbuild.context(buildOptions)).watch();
  }

  async getBundle(_options: BundleRequestOptions): Promise<Uint8Array> {
    this.assertTaskHandler(this.esbuildTaskHandler);

    // TODO: get bundle by options

    const bundleResult = await this.esbuildTaskHandler.task;

    return bundleResult.source;
  }

  async getSourcemap(_options: BundleRequestOptions): Promise<Uint8Array> {
    this.assertTaskHandler(this.esbuildTaskHandler);

    // TODO: get bundle by options

    const bundleResult = await this.esbuildTaskHandler.task;

    return bundleResult.sourcemap;
  }
}
