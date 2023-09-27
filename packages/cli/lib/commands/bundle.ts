import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { logger } from '../shared';
import type { Command, BuildOptions } from '../types';
import { printDebugOptions } from '../helpers';

export const bundle: Command = async (options: BuildOptions) => {
  const { bundleOptions } = options;
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
