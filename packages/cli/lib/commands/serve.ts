import { ReactNativeWebServer } from '@react-native-esbuild/dev-server';
import type { BundleOptions } from '@react-native-esbuild/shared';
import { printDebugOptions } from '../helpers';
import { serveArgvSchema } from '../schema';
import { logger } from '../shared';
import type { Command } from '../types';

/**
 * Start dev server for web.
 */
export const serve: Command = async (argv): Promise<void> => {
  const serveArgv = serveArgvSchema.parse(argv);
  const serveOptions = {
    host: serveArgv.host,
    port: serveArgv.port,
  };

  const bundleOptions: Partial<BundleOptions> = {
    platform: 'web',
    entry: serveArgv['entry-file'],
    dev: serveArgv.dev,
    minify: serveArgv.minify,
  };

  logger.debug('serve options');
  printDebugOptions(serveOptions);
  logger.debug('bundle options');
  printDebugOptions(bundleOptions);

  const server = new ReactNativeWebServer(serveOptions, bundleOptions);
  await server.initialize();
  await server.listen();
};
