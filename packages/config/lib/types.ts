import type { PluginItem } from '@babel/core';

export type BundlerSupportPlatform = 'android' | 'ios' | 'web';

// common
export interface ReactNativeEsbuildConfig {
  transform: {
    svgr?: boolean;
    stripFlowPackageNames?: string[];
    fullyTransformPackageNames?: string[];
    customTransformRules?: CustomTransformRule[];
  };
}

export interface BundleConfig {
  entry?: string;
  outfile?: string;
  sourcemap?: string;
  assetsDir?: string;
  dev?: boolean;
  minify?: boolean;
  metafile?: boolean;
  platform: BundlerSupportPlatform;
}

export interface SwcPresetOptions {
  filename: string;
  root: string;
}

export interface IdParams {
  platform: BundlerSupportPlatform;
  dev: boolean;
  minify: boolean;
}

export enum OptionFlag {
  None = 0b00000000,
  PlatformAndroid = 0b00000001,
  PlatformIos = 0b00000010,
  PlatformWeb = 0b00000100,
  Dev = 0b00001000,
  Minify = 0b00010000,
}

// transformers
export interface CustomTransformRule {
  test: (path: string, source: string) => boolean;
  plugins: PluginItem[];
}
