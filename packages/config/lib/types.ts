import type { PluginItem } from '@babel/core';

export interface EsbuildPresetOptions {
  entryPoint: string;
  outfile: string;
  assetsDir: string;
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
  minify: boolean;
}

export interface SwcPresetOptions {
  filename: string;
}

export interface CoreConfig {
  transform: {
    svgr?: boolean;
    stripFlowPackageNames?: string[];
    fullyTransformPackageNames?: string[];
    customTransformRules?: CustomTransformRule[];
  };
}

export interface CustomTransformRule {
  test: (path: string, source: string) => boolean;
  plugins: PluginItem[];
}
