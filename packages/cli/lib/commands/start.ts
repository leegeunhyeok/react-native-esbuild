/* eslint-disable quotes -- Allow quote in template literal */
import path from 'node:path';
import { ReactNativeAppServer } from '@react-native-esbuild/dev-server';
import { DEFAULT_ENTRY_POINT } from '@react-native-esbuild/shared';
import { enableInteractiveMode, printDebugOptions } from '../helpers';
import { startArgvSchema } from '../schema';
import { logger } from '../shared';
import type { Command } from '../types';

/**
 * Start dev server for native.
 */
export const start: Command = async (argv) => {
  const startArgv = startArgvSchema.parse(argv);
  const entry = path.resolve(startArgv['entry-file'] ?? DEFAULT_ENTRY_POINT);
  const serveOptions = {
    host: startArgv.host,
    port: startArgv.port,
  };
  logger.debug('start options');
  printDebugOptions({ entry, ...serveOptions });

  const server = new ReactNativeAppServer(serveOptions);
  await server.initialize();
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
      logger.nl();
    }
  });
};
