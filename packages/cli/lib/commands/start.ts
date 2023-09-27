/* eslint-disable quotes -- allow quote in template literal */
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { enableInteractiveMode, printDebugOptions } from '../helpers';
import { logger } from '../shared';
import type { Command, StartOptions } from '../types';

// eslint-disable-next-line @typescript-eslint/require-await -- no async task in start command yet
export const start: Command<StartOptions> = async (options) => {
  logger.debug('start options');
  printDebugOptions(options);

  const { bundler, server } = new ReactNativeEsbuildDevServer(
    options,
  ).initialize();

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  server.listen(() => {
    if (
      enableInteractiveMode((keyName) => {
        switch (keyName) {
          case 'r':
            logger.info(`sending 'reload' command...`);
            server.broadcastCommand('reload');
            break;

          case 'd':
            logger.info(`sending 'devMenu' command...`);
            server.broadcastCommand('devMenu');
            break;
        }
      })
    ) {
      logger.info(`> press 'r' to reload`);
      logger.info(`> press 'd' to open developer menu`);
      process.stdout.write('\n');
    }
  });
};
