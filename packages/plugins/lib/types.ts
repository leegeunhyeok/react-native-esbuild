import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Plugin } from 'esbuild';

export type PluginCreator<Config> = (config: Config) => Plugin;

// hermes-transform-plugin
export interface HermesTransformPluginConfig {
  filter?: RegExp;
  enableCache?: boolean;
  fullyTransformPackageNames?: string[];
  customBabelTransformRules?: CustomBabelTransformRule[];
}

export interface CustomBabelTransformRule {
  test: (source: string, path: string) => boolean;
  options: BabelTransformOptions;
}
