import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { LogLevel, Logger } from '@react-native-esbuild/utils';
import { cli } from './cli';
import * as Commands from './commands';
import { getCommand, getOptions, resetCache } from './helpers';
import { logger } from './shared';
import type { BuildOptions, StartOptions } from './types';

(async () => {
  ReactNativeEsbuildBundler.initialize();

  const argv = await cli();
  const options = getOptions(argv);

  Logger.setLogLevel(options.verbose ? LogLevel.Debug : LogLevel.Info);

  if (options.resetCache) {
    await resetCache();
  }

  switch (getCommand(argv)) {
    case 'start':
      await Commands.start(options as StartOptions);
      break;

    case 'bundle':
      await Commands.bundle(options as BuildOptions);
      break;

    case 'cache':
      await Commands.cache(options, getCommand(argv, 1));
      break;

    case 'ram-bundle':
      // eslint-disable-next-line quotes -- message
      logger.warn(`'ram-bundle' command is not supported`);
      break;
  }
})().catch((error) => {
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
    logger.error('uncaught exception thrown', error);
    process.exit(1);
  });
