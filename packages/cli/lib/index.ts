import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { cli } from './cli';
import { enableInteractiveMode, getCommand, getOptions } from './helpers';
import { logger } from './shared';
import type { StartOptions, BuildOptions } from './types';

Promise.resolve(cli())
  .then(async (argv): Promise<void> => {
    const options = getOptions(argv);

    logger.setLogLevel(options.verbose ? 'debug' : 'info');
    logger.setTimestampEnabled(options.timestamp);
    logger.debug('parsed options', options);

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
          .registerPlugin(createReactNativeRuntimeTransformPlugin());

        return void server.listen(() => {
          if (
            enableInteractiveMode((keyName) => {
              switch (keyName) {
                case 'r':
                  server.broadcastCommand('reload');
                  break;

                case 'd':
                  server.broadcastCommand('devMenu');
                  break;
              }
            })
          ) {
            // eslint-disable-next-line quotes -- pass
            logger.info(`› press 'r' to reload`);
            // eslint-disable-next-line quotes -- pass
            logger.info(`› press 'd' to open developer menu`);
            process.stdout.write('\n');
          }
        });
      }

      case 'bundle': {
        const { bundleConfig } = options as BuildOptions;
        const bundler = new ReactNativeEsbuildBundler(
          bundleConfig.entry ? path.dirname(bundleConfig.entry) : process.cwd(),
        );

        bundler
          .registerPlugin(createAssetRegisterPlugin())
          .registerPlugin(createSvgTransformPlugin())
          .registerPlugin(createReactNativeRuntimeTransformPlugin());

        return void (await bundler.bundle(bundleConfig));
      }

      case 'cache': {
        if (getCommand(argv, 1) === 'clean') {
          await resetCache();
        }
      }
    }
  })
  .catch((error) => {
    logger.error('cannot execute command', error as Error);
  });

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
