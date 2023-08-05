import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createHermesTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { cli } from './command';
import { getCommand, getOptions } from './helpers';
import type { StartOptions, BuildOptions } from './types';
import { logger } from './shared';

Promise.resolve(cli())
  .then(async (argv): Promise<void> => {
    logger.setLogLevel(argv.debug ? 'debug' : 'info');

    const resetCache = async (): Promise<void> => {
      await ReactNativeEsbuildBundler.caches.clearAll();
      logger.info('transform cache was reset');
    };

    if (argv.resetCache) {
      await resetCache();
    }

    switch (getCommand(argv)) {
      case 'start': {
        const startOptions = getOptions(argv) as StartOptions;
        const { bundler, server } = new ReactNativeEsbuildDevServer({
          host: startOptions.host,
          port: startOptions.port,
        }).initialize();

        bundler
          .registerPlugin(createAssetRegisterPlugin())
          .registerPlugin(createSvgTransformPlugin())
          .registerPlugin(createHermesTransformPlugin());

        return void server.listen();
      }

      case 'build': {
        const buildOptions = getOptions(argv) as BuildOptions;
        const bundler = new ReactNativeEsbuildBundler();

        bundler
          .registerPlugin(createAssetRegisterPlugin())
          .registerPlugin(createSvgTransformPlugin())
          .registerPlugin(createHermesTransformPlugin());

        return void (await bundler.bundle({
          platform: buildOptions.platform,
          entryPoint: buildOptions.entryFile,
          outfile: buildOptions.outputFile,
          assetsDir: buildOptions.assetsDir,
          dev: buildOptions.dev,
          minify: buildOptions.minify,
        }));
      }

      case 'cache': {
        if (getCommand(argv, 1) === 'clean') {
          await resetCache();
        }
      }
    }
  })
  .catch((error) => logger.error('cannot execute command', error as Error));
