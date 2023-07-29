import esbuild, {
  type Plugin,
  type BuildOptions,
  type BuildResult,
  type BuildContext,
} from 'esbuild';
import deepmerge from 'deepmerge';
import { getESbuildOptions } from '@react-native-esbuild/config';
import { createPromiseHandler } from '../helpers';
import {
  BundleTaskSignal,
  type BundleOptions,
  type BundleResult,
  type BundleRequestOptions,
  type PromiseHandler,
} from '../types';

export class ReactNativeEsbuildBundler {
  private esbuildContext?: BuildContext;
  private esbuildTaskHandler?: PromiseHandler<BundleResult>;
  private bundleResult?: BundleResult;

  constructor(
    private options: BundleOptions,
    private customEsbuildOptions?: Partial<BuildOptions>,
  ) {}

  private getBuildOptionsForBundler(mode: 'bundle' | 'watch'): BuildOptions {
    return getESbuildOptions(
      this.options,
      deepmerge(
        {
          plugins: [
            mode === 'watch' ? this.getBuildStatusPlugin() : null,
            // TODO
          ].filter(Boolean),
          write: mode === 'bundle',
        },
        this.customEsbuildOptions ?? {},
      ),
    );
  }

  private getBuildStatusPlugin(): Plugin {
    return {
      name: 'build-task-plugin',
      setup: (build): void => {
        const bundleFilename = this.options.outfile;
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

  async bundle(): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler('bundle');
    return esbuild.build(buildOptions);
  }

  async watch(): Promise<void> {
    const buildOptions = this.getBuildOptionsForBundler('watch');
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
      throw BundleTaskSignal.NotStarted;
    }
  }

  async getBundle(_options: BundleRequestOptions): Promise<Uint8Array> {
    this.assertTaskHandler(this.esbuildTaskHandler);

    // TODO: get bundle by options

    const bundleResult = await this.esbuildTaskHandler.task;

    return bundleResult.source;
  }

  async getSourcemap(): Promise<Uint8Array> {
    this.assertTaskHandler(this.esbuildTaskHandler);

    // TODO: get bundle by options

    const bundleResult = await this.esbuildTaskHandler.task;

    return bundleResult.sourcemap;
  }
}
