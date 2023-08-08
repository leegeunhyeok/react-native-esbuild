// asset-register-plugin
export interface AssetRegisterPluginConfig {
  assetExtensions?: string[];
}

export interface Asset {
  path: string;
  basename: string;
  extension: string;
  scales: number[];
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
