import type { BundlerSupportPlatform } from '@react-native-esbuild/config';

// asset-register-plugin
export interface AssetRegisterPluginConfig {
  assetExtensions?: string[];
}

export interface SuffixPathResult {
  path: string;
  dirname: string;
  basename: string;
  extension: string;
  platform: BundlerSupportPlatform | null;
}

// react-native-runtime-transform-plugin
export interface ReactNativeRuntimeTransformPluginConfig {
  injectScriptPaths?: string[];
}

export interface CacheConfig {
  hash: string;
  mtimeMs: number;
}
