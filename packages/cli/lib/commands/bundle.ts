import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import type { BundleOptions } from '@react-native-esbuild/config';
import { printDebugOptions } from '../helpers';
import { bundleArgvSchema } from '../schema';
import { logger } from '../shared';
import type { Command } from '../types';

export const bundle: Command = async (argv) => {
  const bundleArgv = bundleArgvSchema.parse(argv);
  const bundleOptions: Partial<BundleOptions> = {
    entry: bundleArgv['entry-file'],
    sourcemap: bundleArgv['sourcemap-output'],
    outfile: bundleArgv['bundle-output'],
    assetsDir: bundleArgv['assets-dest'],
    platform: bundleArgv.platform,
    dev: bundleArgv.dev,
    minify: bundleArgv.minify,
    metafile: bundleArgv.metafile,
  };
  logger.debug('bundle options');
  printDebugOptions(bundleOptions);

  const bundler = new ReactNativeEsbuildBundler(
    bundleOptions.entry ? path.dirname(bundleOptions.entry) : process.cwd(),
  );

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  await bundler.bundle(bundleOptions);
};
