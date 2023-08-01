import type { Plugin, BuildResult } from 'esbuild';
import type { CustomBabelTransformOption } from '@react-native-esbuild/config';

export type PluginCreator<Config> = (config: Config) => Plugin;

// asset-register-plugin
export interface AssetRegisterPluginConfig {
  assetExtensions: string[];
}

export type AssetScale = 1 | 2 | 3;

export interface SuffixPathResult {
  dirname: string;
  basename: string;
  extension: string;
  path: string;
}

export interface RegistrationScriptParams {
  basename: string;
  extension: string;
  hash: string;
  relativePath: string;
  httpServerLocation: string;
  scales: number[];
  dimensions: { width: number; height: number };
}

// hermes-transform-plugin
export interface HermesTransformPluginConfig {
  enableCache?: boolean;
  fullyTransformPackageNames?: string[];
  customBabelTransformRules?: CustomBabelTransformOption[];
}

// build-status-plugin
export interface BuildStatusPluginConfig {
  printSpinner?: boolean;
  onStart?: () => void;
  onResolve?: (path: string) => void;
  onLoad?: (path: string) => void;
  onEnd?: (result: BuildResult<{ write: false }>) => void;
}
