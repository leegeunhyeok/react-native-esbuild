import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import type { Command, BuildOptions } from '../types';

export const bundle: Command = async (options: BuildOptions) => {
  const { bundleConfig } = options;
  const bundler = new ReactNativeEsbuildBundler(
    bundleConfig.entry ? path.dirname(bundleConfig.entry) : process.cwd(),
  );

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  await bundler.bundle(bundleConfig);
};
