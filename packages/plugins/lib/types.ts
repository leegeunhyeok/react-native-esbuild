import type { OnLoadArgs } from 'esbuild';

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
}

export type AssetScale = 1 | 2 | 3;

export interface SuffixPathResult {
  dirname: string;
  basename: string;
  extension: string;
  path: string;
}

// hermes-transform-plugin
export type Transformer<Options> = (
  code: string,
  context: { args: OnLoadArgs; root: string },
  customOption?: Options,
) => string | Promise<string>;
