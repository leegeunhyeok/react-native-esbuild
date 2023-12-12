import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  DEFAULT_WEB_ENTRY_POINT,
  type BundleOptions,
} from '@react-native-esbuild/shared';
import { printDebugOptions } from '../helpers';
import { bundleArgvSchema } from '../schema';
import { logger } from '../shared';
import type { Command } from '../types';

/**
 * Create bundle command.
 */
export const bundle: Command = async (argv) => {
  const bundleArgv = bundleArgvSchema.parse(argv);
  const bundleOptions: Partial<BundleOptions> = {
    entry: path.resolve(bundleArgv['entry-file'] ?? DEFAULT_WEB_ENTRY_POINT),
    sourcemap: bundleArgv['sourcemap-output'],
    outfile: bundleArgv['bundle-output'],
    assetsDir: bundleArgv['assets-dest'],
    platform: bundleArgv.platform,
    dev: bundleArgv.dev,
    minify: bundleArgv.minify,
    metafile: bundleArgv.metafile,
  };
  const root = bundleOptions.entry
    ? path.dirname(bundleOptions.entry)
    : process.cwd();
  logger.debug('bundle options');
  printDebugOptions(bundleOptions);

  const bundler = new ReactNativeEsbuildBundler(root);
  await bundler.initialize();
  await bundler.bundle(bundleOptions);
};
