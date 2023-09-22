import type { BundlerSupportPlatform } from '@react-native-esbuild/config';

// asset-register-plugin
export interface AssetRegisterPluginConfig {
  assetExtensions?: string[];
}

export interface Asset {
  // `/path/to/asset/image.png`
  path: string;
  // `image.png`
  basename: string;
  // `image`
  name: string;
  // `.png`
  extension: string;
  // `png`
  type: string;
  // [1, 2, 3]
  scales: number[];
  httpServerLocation: string;
  hash: string;
  dimensions: { width: number; height: number };
  platform: BundlerSupportPlatform | null;
}

export type AssetScale = 1 | 2 | 3;

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
