import type { ReactNativeEsbuildPluginCreator } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';

const native: ReactNativeEsbuildPluginCreator<unknown>[] = [
  createAssetRegisterPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];

const web: ReactNativeEsbuildPluginCreator<unknown>[] = [
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];

export const presets = { native, web };
