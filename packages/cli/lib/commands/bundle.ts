import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import type { Command, BuildOptions } from '../types';

export const bundle: Command = async (options: BuildOptions) => {
  const { bundleOptions } = options;
  const bundler = new ReactNativeEsbuildBundler(
    bundleOptions.entry ? path.dirname(bundleOptions.entry) : process.cwd(),
  );

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  await bundler.bundle(bundleOptions);
};
