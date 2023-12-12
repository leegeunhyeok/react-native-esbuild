import type { BuildResult, Plugin } from 'esbuild';
import type { BuildMode } from '../enums';
import type { Config } from './config';

export type SupportedPlatform = 'android' | 'ios' | 'web';

// Internal task id.
export type Id = number;

// Internal bundler options.
export interface BundleOptions {
  platform: SupportedPlatform;
  entry: string;
  outfile: string;
  dev: boolean;
  minify: boolean;
  metafile: boolean;
  sourcemap?: string;
  assetsDir?: string;
}

export interface BuildContext {
  id: Id;
  root: string;
  mode: BuildMode;
  config: Config;
  bundleOptions: BundleOptions;
  moduleManager: ModuleManager;
  cacheStorage: CacheStorage;
  hmrEnabled: boolean;
  /**
   * ```ts
   * interface AdditionalData {
   *   // Set string value when HMR is enabled.
   *   externalPattern?: string;
   * }
   * ```
   */
  additionalData: AdditionalData;
}

export type AdditionalData = Record<string, unknown>;

export interface BuildStatusListener {
  onBuildStart: (context: BuildContext) => void;
  onBuild: (context: BuildContext, status: BuildStatus) => void;
  onBuildEnd: (
    context: BuildContext,
    data: {
      result: BuildResult;
      success: boolean;
    },
    status: BuildStatus,
  ) => void;
}

/**
 * - `total`: total module count
 * - `resolved`: resolved module count
 * - `loaded`: loaded module count
 */
export interface BuildStatus {
  total: number;
  resolved: number;
  loaded: number;
}

// Internal plugin factory.
export type PluginFactory<PluginConfig = void> = (
  context: BuildContext,
  config?: PluginConfig,
) => Plugin;

// Caches
export interface Cache {
  data: string;
  mtimeMs: number;
}

export interface CacheStorage {
  readFromMemory: (key: string) => Cache | undefined;
  readFromFileSystem: (key: string) => Promise<string | undefined>;
  writeToMemory: (key: string, cacheData: Cache) => void;
  writeToFileSystem: (key: string, data: string) => Promise<void>;
}

// Modules
export type ModuleId = number;

export interface ModuleManager {
  /**
   * @param modulePath - actual module path(`path` value in esbuild metafile).
   */
  getModuleId: (modulePath: string, isEntryPoint?: boolean) => number;
}
