import type { ReactNativeEsbuildPluginCreator } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
type AnyPlugin = any;

const native: ReactNativeEsbuildPluginCreator<AnyPlugin>[] = [
  createAssetRegisterPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];

const web: ReactNativeEsbuildPluginCreator<AnyPlugin>[] = [
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];

export const presets = { native, web };
