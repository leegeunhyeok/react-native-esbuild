import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { LogLevel, Logger } from '@react-native-esbuild/utils';
import { cli } from './cli';
import * as Commands from './commands';
import { getCommand, resetCache, handleUncaughtException } from './helpers';
import { baseArgvSchema } from './schema';
import { logger } from './shared';

(async () => {
  ReactNativeEsbuildBundler.initialize();

  const argv = await cli();
  const options = baseArgvSchema.parse(argv);

  Logger.setGlobalLogLevel(options.verbose ? LogLevel.Debug : LogLevel.Info);

  if (options['reset-cache']) {
    await resetCache();
  }

  switch (getCommand(argv)) {
    case 'start':
      await Commands.start(argv);
      break;

    case 'serve':
      await Commands.serve(argv);
      break;

    case 'bundle':
      await Commands.bundle(argv);
      break;

    case 'cache':
      await Commands.cache(argv, getCommand(argv, 1));
      break;

    case 'ram-bundle':
      // eslint-disable-next-line quotes -- message
      logger.warn(`'ram-bundle' command is not supported`);
      process.exit(1);
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
    if (!handleUncaughtException(error)) {
      logger.error('uncaught exception thrown', error);
    }
    process.exit(1);
  });
