import path from 'node:path';
import EventEmitter from 'node:events';
import esbuild, {
  type BuildOptions,
  type BuildResult,
  type BuildContext,
} from 'esbuild';
import {
  createAssetRegisterPlugin,
  createBuildStatusPlugin,
  createHermesTransformPlugin,
} from '@react-native-esbuild/plugins';
import {
  getCoreOptions,
  getEsbuildOptions,
  ASSET_EXTENSIONS,
  type CoreOptions,
} from '@react-native-esbuild/config';
import { colors, isCI } from '@react-native-esbuild/utils';
import { createPromiseHandler } from '../helpers';
import { BundleTaskSignal } from '../types';
import type {
  BundlerConfig,
  BundlerSupportPlatform,
  BundleResult,
  BundleRequestOptions,
  PromiseHandler,
} from '../types';
import { logger } from '../shared';
import { printLogo } from './logo';

export class ReactNativeEsbuildBundler extends EventEmitter {
  private coreOptions: CoreOptions;
  private esbuildContext?: BuildContext;
  private esbuildTaskHandler?: PromiseHandler<BundleResult>;
  private bundleResult?: BundleResult;

  constructor(private config: BundlerConfig) {
    super();
    if (isCI()) colors.disable();
    printLogo();
    this.loadOptions();
  }

  private loadOptions(): void {
    let config: CoreOptions | undefined;
    const workDirectory = process.cwd();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      config = require(path.resolve(
        workDirectory,
        'react-native-esbuild.config.js',
      )).default;
    } catch {
      // empty
    }

    this.coreOptions = getCoreOptions(config);
  }

  private getBuildOptionsForBundler(
    platform: 'android' | 'ios' | 'web',
    mode: 'bundle' | 'watch',
  ): BuildOptions {
    const { entryPoint, outfile, assetsDir, dev, minify } = this.config;
    const { cache, transform } = this.coreOptions;

    return getEsbuildOptions(
      {
        entryPoint,
        outfile,
        assetsDir,
        dev,
        minify,
        platform,
      },
      {
        plugins: [
          createBuildStatusPlugin({
            printSpinner: true,
            onStart: () => this.handleBuildStart(),
            onEnd: (result) => this.handleBuildEnd(result),
          }),
          createAssetRegisterPlugin({
            assetExtensions: ASSET_EXTENSIONS,
          }),
          createHermesTransformPlugin({
            enableCache: cache,
            fullyTransformPackageNames: transform.fullyTransformPackageNames,
          }),
        ].filter(Boolean),
        write: mode === 'bundle',
      },
    );
  }

  private handleBuildStart(): void {
    this.esbuildTaskHandler?.rejecter?.(BundleTaskSignal.Cancelled);
    this.esbuildTaskHandler = createPromiseHandler();
    this.emit('build-start');
  }

  private handleBuildEnd(result: BuildResult<{ write: false }>): void {
    const bundleFilename = this.config.outfile;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const { outputFiles } = result;

    // `outputFiles` available when only `write: false`
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (outputFiles === undefined) {
      return;
    }

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
      this.emit('build-end');
    }
  }

  async bundle(platform: BundlerSupportPlatform): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'bundle');
    logger.debug('prepare for bundle mode', { platform });
    logger.debug('current esbuild options', buildOptions);
    return esbuild.build(buildOptions);
  }

  async watch(platform: BundlerSupportPlatform): Promise<void> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'watch');
    logger.debug('prepare for watch mode', { platform });
    logger.debug('current esbuild options', buildOptions);
    (this.esbuildContext = await esbuild.context(buildOptions)).watch();
  }

  getContext(): BuildContext | null {
    if (this.esbuildContext) {
      return this.esbuildContext;
    }
    logger.warn('esbuild context is empty');
    return null;
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
