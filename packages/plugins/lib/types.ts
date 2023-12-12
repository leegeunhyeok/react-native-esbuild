import type { BuildStatusListener } from '@react-native-esbuild/shared';

// assetRegisterPlugin
export interface AssetRegisterPluginConfig {
  assetExtensions?: string[];
}

export interface SuffixPathResult {
  path: string;
  dirname: string;
  basename: string;
  extension: string;
  platform: string | null;
}

// buildStatusPlugin
export interface BuildStatusPluginConfig {
  handler?: BuildStatusListener;
}
