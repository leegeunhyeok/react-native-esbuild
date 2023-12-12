import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import type { PluginFactory } from '@react-native-esbuild/shared';

export const native: PluginFactory<unknown>[] = [
  createAssetRegisterPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];

export const web: PluginFactory<unknown>[] = [
  createReactNativeWebPlugin,
  createSvgTransformPlugin,
  createReactNativeRuntimeTransformPlugin,
];
