import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
  createReactNativeWebPlugin,
} from '@react-native-esbuild/plugins';
import {
  DEFAULT_ENTRY_POINT,
  type BundleOptions,
} from '@react-native-esbuild/config';
import { printDebugOptions } from '../helpers';
import { bundleArgvSchema } from '../schema';
import { logger } from '../shared';
import type { Command } from '../types';

export const bundle: Command = async (argv) => {
  const bundleArgv = bundleArgvSchema.parse(argv);
  const bundleOptions: Partial<BundleOptions> = {
    entry: path.resolve(bundleArgv['entry-file'] ?? DEFAULT_ENTRY_POINT),
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

  const bundler = await new ReactNativeEsbuildBundler(
    bundleOptions.entry ? path.dirname(bundleOptions.entry) : process.cwd(),
  ).initialize();

  // @TODO: remove registerPlugin and add plugin presets (plugin preset builder)
  if (bundleOptions.platform !== 'web') {
    bundler.registerPlugin(createAssetRegisterPlugin());
  }

  bundler
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin())
    .registerPlugin(createReactNativeWebPlugin());

  await bundler.bundle(bundleOptions);
};
