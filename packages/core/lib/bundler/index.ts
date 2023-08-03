import path from 'node:path';
import EventEmitter from 'node:events';
import esbuild, {
  type Plugin,
  type BuildOptions,
  type BuildResult,
  type BuildContext,
} from 'esbuild';
import ora from 'ora';
import {
  loadConfig,
  getEsbuildOptions,
  type CoreConfig,
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
  private config: CoreConfig;
  private plugins: Plugin[];
  private esbuildContext?: BuildContext;
  private esbuildTaskHandler?: PromiseHandler<BundleResult>;
  private bundleResult?: BundleResult;

  constructor(private bundlerConfig: BundlerConfig) {
    super();
    if (isCI()) colors.disable();
    printLogo();
    this.config = loadConfig();
  }

  private getBuildOptionsForBundler(
    platform: 'android' | 'ios' | 'web',
    mode: 'bundle' | 'watch',
  ): BuildOptions {
    return getEsbuildOptions(
      { ...this.bundlerConfig, platform },
      {
        plugins: [
          /**
           * `build-status-plugin` is required and must be placed first
           */
          this.createBuildStatusPlugin(),
          ...this.plugins,
        ].filter(Boolean),
        write: mode === 'bundle',
      },
    );
  }

  private createBuildStatusPlugin(): Plugin {
    const buildStatusPlugin: Plugin = {
      name: 'build-status-plugin',
      setup: (build): void => {
        const spinner = ora({
          color: 'yellow',
          prefixText: colors.bgYellow(colors.black(' » esbuild ')),
        });
        // eslint-disable-next-line prefer-named-capture-group
        const filter = /(.*?)/;
        const moduleResolved = new Set<string>();
        let startTime: Date | null = null;
        let moduleLoaded = 0;

        const updateStatusText = (): void => {
          spinner.text = `build in progress... (${moduleLoaded}/${moduleResolved.size})`;
        };

        build.onStart(() => {
          moduleResolved.clear();
          moduleLoaded = 0;
          updateStatusText();
          spinner.start();
          this.handleBuildStart();
          startTime = new Date();
        });

        build.onResolve({ filter }, (args) => {
          const isRelative = args.path.startsWith('.');
          moduleResolved.add(
            isRelative ? path.resolve(args.resolveDir, args.path) : args.path,
          );
          return null;
        });

        build.onLoad({ filter }, () => {
          ++moduleLoaded;
          updateStatusText();
          return null;
        });

        build.onEnd((result: BuildResult<{ write: false }>) => {
          const endTime = new Date().getTime() - (startTime?.getTime() ?? 0);
          const statusText = colors.gray(`(${endTime / 1000}s)`);
          result.errors.length
            ? spinner.fail(`failed! ${statusText}`)
            : spinner.succeed(`done! ${statusText}`);
          spinner.stop();

          this.handleBuildEnd(result);
        });
      },
    };

    return buildStatusPlugin;
  }

  private handleBuildStart(): void {
    this.esbuildTaskHandler?.rejecter?.(BundleTaskSignal.Cancelled);
    this.esbuildTaskHandler = createPromiseHandler();
    this.emit('build-start');
  }

  private handleBuildEnd(result: BuildResult): void {
    const bundleFilename = this.bundlerConfig.outfile;
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
      this.emit('build-end');
    }
  }

  async bundle(platform: BundlerSupportPlatform): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'bundle');
    logger.debug('preparing bundle mode', { platform });
    logger.debug('esbuild option', buildOptions);
    return esbuild.build(buildOptions);
  }

  async watch(platform: BundlerSupportPlatform): Promise<void> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'watch');
    logger.debug('preparing watch mode', { platform });
    logger.debug('esbuild option', buildOptions);
    (this.esbuildContext = await esbuild.context(buildOptions)).watch();
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

  registerPlugins(
    register: (config: CoreConfig, bundlerConfig: BundlerConfig) => Plugin[],
  ): this {
    this.plugins = register(this.config, this.bundlerConfig);
    return this;
  }

  getContext(): BuildContext | null {
    if (this.esbuildContext) {
      return this.esbuildContext;
    }
    logger.warn('esbuild context is empty');
    return null;
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
