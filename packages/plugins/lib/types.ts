import type { Plugin, BuildResult } from 'esbuild';
import type { CustomBabelTransformOption } from '@react-native-esbuild/config';

export type PluginCreator<Config> = (config: Config) => Plugin;

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
