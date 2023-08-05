import type { OnLoadArgs } from 'esbuild';
import type { CacheController } from '@react-native-esbuild/core';
import type { CustomTransformRule } from '@react-native-esbuild/config';

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

// hermes-transform-plugin
interface CacheParams {
  cacheEnabled: boolean;
  cacheController: CacheController;
}

export interface GetCacheParam extends CacheParams {
  args: OnLoadArgs;
}

export type GetCacheResult = BaseCacheResult | NoCacheResult;

export interface BaseCacheResult {
  contents: string;
  modifiedAt: number;
}

export interface NoCacheResult extends BaseCacheResult {
  content: string;
  hash: string;
}

export interface TransformSourceParam extends CacheParams {
  args: OnLoadArgs;
  rawSource: string;
  hash?: string;
  stripFlowPackageNamesRegExp?: RegExp;
  fullyTransformPackagesRegExp?: RegExp;
  customTransformRules?: CustomTransformRule[];
}
