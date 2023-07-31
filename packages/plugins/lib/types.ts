import type { Plugin } from 'esbuild';
import type { CustomBabelTransformOption } from '@react-native-esbuild/config';

export type PluginCreator<Config> = (config: Config) => Plugin;

// hermes-transform-plugin
export interface HermesTransformPluginConfig {
  enableCache?: boolean;
  fullyTransformPackageNames?: string[];
  customBabelTransformRules?: CustomBabelTransformOption[];
}
