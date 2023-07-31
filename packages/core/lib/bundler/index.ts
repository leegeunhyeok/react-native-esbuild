import esbuild, {
  type Plugin,
  type BuildOptions,
  type BuildResult,
  type BuildContext,
} from 'esbuild';
import {
  createAssetRegisterPlugin,
  createHermesTransformPlugin,
} from '@react-native-esbuild/plugins';
import { getESbuildOptions } from '@react-native-esbuild/config';
import { isCI } from '@react-native-esbuild/utils';
import * as colors from 'colors';
import { createPromiseHandler } from '../helpers';
import { BundleTaskSignal } from '../types';
import type {
  BundlerConfig,
  BundlerSupportPlatform,
  BundleResult,
  BundleRequestOptions,
  PromiseHandler,
} from '../types';
import { printLogo } from './logo';

export class ReactNativeEsbuildBundler {
  private esbuildContext?: BuildContext;
  private esbuildTaskHandler?: PromiseHandler<BundleResult>;
  private bundleResult?: BundleResult;

  constructor(private config: BundlerConfig) {
    if (isCI()) colors.disable();
    printLogo();
  }

  private getBuildOptionsForBundler(
    platform: 'android' | 'ios' | 'web',
    mode: 'bundle' | 'watch',
  ): BuildOptions {
    const { entryPoint, outfile, assetsDir, dev, minify } = this.config;

    return getESbuildOptions(
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
          mode === 'watch' ? this.getBuildStatusPlugin() : null,
          createAssetRegisterPlugin(),
          createHermesTransformPlugin({}),
        ].filter(Boolean) as Plugin[],
        write: mode === 'bundle',
      },
    );
  }

  private getBuildStatusPlugin(): Plugin {
    return {
      name: 'build-task-plugin',
      setup: (build): void => {
        const bundleFilename = this.config.outfile;
        const bundleSourcemapFilename = `${bundleFilename}.map`;

        const findFromOutputFile = (filename: string) => {
          return <T extends { path: string }>({ path }: T) =>
            path.endsWith(filename);
        };

        build.onStart(() => {
          // reject previous task with cancelled signal
          this.esbuildTaskHandler?.rejecter?.(BundleTaskSignal.Cancelled);
          this.esbuildTaskHandler = createPromiseHandler();
        });

        build.onEnd((result: BuildResult<{ write: false }>) => {
          try {
            const { outputFiles } = result;
            const bundleOutput = outputFiles.find(
              findFromOutputFile(bundleFilename),
            );
            const bundleSourcemapOutput = outputFiles.find(
              findFromOutputFile(bundleSourcemapFilename),
            );

            if (!(bundleOutput && bundleSourcemapOutput)) {
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
          }
        });
      },
    };
  }

  async bundle(platform: BundlerSupportPlatform): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'bundle');
    return esbuild.build(buildOptions);
  }

  async watch(platform: BundlerSupportPlatform): Promise<void> {
    const buildOptions = this.getBuildOptionsForBundler(platform, 'watch');
    (this.esbuildContext = await esbuild.context(buildOptions)).watch();
  }

  getContext(): BuildContext | null {
    return this.esbuildContext ?? null;
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
