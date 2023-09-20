import path from 'node:path';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import type { BuildOptions } from '../types';

export async function bundle(options: BuildOptions): Promise<void> {
  const { bundleConfig } = options;
  const bundler = new ReactNativeEsbuildBundler(
    bundleConfig.entry ? path.dirname(bundleConfig.entry) : process.cwd(),
  );

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  await bundler.bundle(bundleConfig);
}
