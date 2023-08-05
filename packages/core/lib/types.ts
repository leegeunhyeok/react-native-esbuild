import type { ReactNativeEsbuildConfig } from '@react-native-esbuild/config';
import type { Plugin } from 'esbuild';

export type BundlerSupportPlatform = 'android' | 'ios' | 'web';

export interface BundleConfig {
  entryPoint: string;
  outfile: string;
  assetsDir: string;
  dev: boolean;
  minify: boolean;
  platform: BundlerSupportPlatform;
}

export interface BundleRequestOptions {
  platform: BundlerSupportPlatform;
  dev: boolean;
  minify: boolean;
  runModule: boolean;
}

export interface BundleResult {
  source: Uint8Array;
  sourcemap: Uint8Array;
}

export enum BundleTaskSignal {
  Cancelled,
  EmptyOutput,
  WatchModeNotStarted,
}

export type EsbuildPluginFactory<PluginConfig = void> = (
  config?: PluginConfig,
) => (context: PluginContext) => Plugin;

export interface PluginContext extends BundleConfig {
  config: ReactNativeEsbuildConfig;
}

export interface PromiseHandler<Result> {
  task: Promise<Result>;
  resolver?: (val: Result) => void;
  rejecter?: (reason?: unknown) => void;
}

export interface Cache {
  data: string;
  modifiedAt: number;
}
