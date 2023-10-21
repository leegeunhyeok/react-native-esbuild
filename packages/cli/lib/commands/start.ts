/* eslint-disable quotes -- allow quote in template literal */
import path from 'node:path';
import { ReactNativeAppServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
} from '@react-native-esbuild/plugins';
import { DEFAULT_ENTRY_POINT } from '@react-native-esbuild/config';
import { enableInteractiveMode, printDebugOptions } from '../helpers';
import { logger } from '../shared';
import { startArgvSchema } from '../schema';
import type { Command } from '../types';

// eslint-disable-next-line @typescript-eslint/require-await -- no async task in start command yet
export const start: Command = async (argv) => {
  const startArgv = startArgvSchema.parse(argv);
  const entry = path.resolve(startArgv['entry-file'] ?? DEFAULT_ENTRY_POINT);
  const serveOptions = {
    host: startArgv.host,
    port: startArgv.port,
  };
  logger.debug('start options');
  printDebugOptions({ entry, ...serveOptions });

  const server = await new ReactNativeAppServer(serveOptions).initialize(
    (bundler) => {
      bundler
        .registerPlugin(createAssetRegisterPlugin())
        .registerPlugin(createSvgTransformPlugin())
        .registerPlugin(createReactNativeRuntimeTransformPlugin());
    },
  );

  await server.listen(() => {
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
