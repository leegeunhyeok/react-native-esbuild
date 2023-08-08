import EventEmitter from 'node:events';
import esbuild, { type BuildOptions, type BuildResult } from 'esbuild';
import { colors, isCI } from '@react-native-esbuild/utils';
import {
  loadConfig,
  getEsbuildOptions,
  DEFAULT_OUTFILE,
  type ReactNativeEsbuildConfig,
  type BundleConfig,
  bitwiseOptions,
} from '@react-native-esbuild/config';
import { CacheStorage } from '../cache';
import { createPromiseHandler } from '../helpers';
import { logger } from '../shared';
import { BundleTaskSignal } from '../types';
import type {
  BundleRequestOptions,
  EsbuildPluginFactory,
  PluginContext,
  RunType,
  BuildTask,
} from '../types';
import { createBuildStatusPlugin } from './internal';
import { printLogo } from './logo';

export class ReactNativeEsbuildBundler extends EventEmitter {
  public static caches = CacheStorage.getInstance();
  private config: ReactNativeEsbuildConfig;
  private buildTasks = new Map<number, BuildTask>();
  private plugins: ReturnType<EsbuildPluginFactory<unknown>>[] = [];

  constructor(private root: string = process.cwd()) {
    super();
    if (isCI()) colors.disable();
    printLogo();
    this.config = loadConfig();
  }

  private getBuildOptionsForBundler(
    bundleConfig: BundleConfig,
    mode: RunType,
  ): BuildOptions {
    if (!this.plugins.length) {
      throw new Error('plugin is not registered');
    }

    const context: PluginContext = {
      ...bundleConfig,
      taskId: this.identifyTaskByBundleConfig(bundleConfig),
      mode,
      root: this.root,
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

  private identifyTaskByBundleConfig({
    platform,
    dev = true,
    minify = true,
  }: BundleConfig): number {
    return bitwiseOptions({ platform, dev, minify });
  }

  private assertBuildTask(task?: BuildTask): asserts task is BuildTask {
    if (task) return;
    throw new Error('unable to get build task');
  }

  private handleBuildStart(_context: PluginContext): void {
    this.emit('build-start');
  }

  private handleBuildEnd(result: BuildResult, context: PluginContext): void {
    const bundleFilename = context.outfile ?? DEFAULT_OUTFILE;
    const bundleSourcemapFilename = `${bundleFilename}.map`;
    const { outputFiles } = result;

    // `outputFiles` available when only `write: false`
    if (outputFiles === undefined) return;

    const currentTask = this.buildTasks.get(context.taskId);
    this.assertBuildTask(currentTask);

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
        currentTask.handler?.rejecter?.(BundleTaskSignal.EmptyOutput);
        return;
      }

      currentTask.handler?.resolver?.({
        source: bundleOutput.contents,
        sourcemap: bundleSourcemapOutput.contents,
      });
    } catch (error) {
      currentTask.handler?.rejecter?.(error);
    } finally {
      currentTask.status = 'resolved';
      this.emit('build-end');
    }
  }

  registerPlugin(plugin: ReturnType<EsbuildPluginFactory<unknown>>): this {
    this.plugins.push(plugin);
    return this;
  }

  async bundle(bundleConfig: BundleConfig): Promise<BuildResult> {
    const buildOptions = this.getBuildOptionsForBundler(bundleConfig, 'bundle');
    logger.debug('preparing bundle mode', { platform: bundleConfig.platform });
    logger.debug('esbuild option', buildOptions);
    return esbuild.build(buildOptions);
  }

  async getBundle(bundleConfig: BundleConfig): Promise<Uint8Array> {
    const targetTaskId = this.identifyTaskByBundleConfig(bundleConfig);

    if (!this.buildTasks.has(targetTaskId)) {
      logger.debug(`bundle task not registered (id: ${targetTaskId})`);
      const buildOptions = this.getBuildOptionsForBundler(
        bundleConfig,
        'watch',
      );
      const context = await esbuild.context(buildOptions);
      this.buildTasks.set(targetTaskId, {
        context,
        handler: createPromiseHandler(),
        status: 'pending',
      });
      await context.watch();
      logger.debug(`bundle task is now watching: (id: ${targetTaskId})`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const targetTask = this.buildTasks.get(targetTaskId)!;
    if (targetTask.handler === null || targetTask.status === 'resolved') {
      targetTask.handler = createPromiseHandler();
      await targetTask.context.rebuild();
    }

    return (await targetTask.handler.task).source;
  }

  async getSourcemap(_options: BundleRequestOptions): Promise<void> {
    // TODO
  }
}
