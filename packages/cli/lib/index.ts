import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createHermesTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { cli } from './command';
import { getCommand, getOptions } from './helpers';
import { logger } from './shared';
import type { StartOptions, BuildOptions } from './types';

Promise.resolve(cli())
  .then(async (argv): Promise<void> => {
    const options = getOptions(argv);

    logger.setLogLevel(options.debug ? 'debug' : 'info');

    const resetCache = async (): Promise<void> => {
      await ReactNativeEsbuildBundler.caches.clearAll();
      logger.info('transform cache was reset');
    };

    if (options.resetCache) {
      await resetCache();
    }

    switch (getCommand(argv)) {
      case 'start': {
        const startOptions = options as StartOptions;
        const { bundler, server } = new ReactNativeEsbuildDevServer(
          startOptions,
        ).initialize();

        bundler
          .registerPlugin(createAssetRegisterPlugin())
          .registerPlugin(createSvgTransformPlugin())
          .registerPlugin(createHermesTransformPlugin());

        return void server.listen();
      }

      case 'build': {
        const { bundleConfig } = options as BuildOptions;
        const bundler = new ReactNativeEsbuildBundler(
          path.dirname(bundleConfig.entry ?? process.cwd()),
        );

        bundler
          .registerPlugin(createAssetRegisterPlugin())
          .registerPlugin(createSvgTransformPlugin())
          .registerPlugin(createHermesTransformPlugin());

        return void (await bundler.bundle(bundleConfig));
      }

      case 'cache': {
        if (getCommand(argv, 1) === 'clean') {
          await resetCache();
        }
      }
    }
  })
  .catch((error) => logger.error('cannot execute command', error as Error));

process
  .on('unhandledRejection', (reason, promise) => {
    logger.error('unhandled rejection at promise', undefined, {
      reason,
      promise,
    });
    process.exit(1);
  })
  .on('uncaughtException', (error) => {
    logger.error('uncaught Exception thrown', error);
    process.exit(1);
  });
