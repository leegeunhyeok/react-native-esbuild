import type { PluginItem } from '@babel/core';

// common
export interface CoreConfig {
  transform: {
    svgr?: boolean;
    stripFlowPackageNames?: string[];
    fullyTransformPackageNames?: string[];
    customTransformRules?: CustomTransformRule[];
  };
}
export interface SwcPresetOptions {
  filename: string;
}

export interface BitwiseOptions {
  platform: 'android' | 'ios' | 'web';
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
export interface EsbuildPresetOptions {
  entryPoint: string;
  outfile: string;
  assetsDir: string;
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
  minify: boolean;
}

export interface CustomTransformRule {
  test: (path: string, source: string) => boolean;
  plugins: PluginItem[];
}
