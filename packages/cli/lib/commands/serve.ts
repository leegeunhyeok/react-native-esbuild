import {
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
  createReactNativeWebPlugin,
} from '@react-native-esbuild/plugins';
import { ReactNativeWebServer } from '@react-native-esbuild/dev-server';
import type { BundleOptions } from '@react-native-esbuild/config';
import { printDebugOptions } from '../helpers';
import { logger } from '../shared';
import type { Command } from '../types';
import { serveArgvSchema } from '../schema';

// eslint-disable-next-line @typescript-eslint/require-await -- no async task in serve command
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

  new ReactNativeWebServer(serveOptions, bundleOptions)
    .setup((bundler) => {
      bundler
        .registerPlugin(createSvgTransformPlugin())
        .registerPlugin(createReactNativeRuntimeTransformPlugin())
        .registerPlugin(createReactNativeWebPlugin());
    })
    .listen();
};
