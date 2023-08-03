import type { Plugin } from 'esbuild';

export type BundlerSupportPlatform = 'android' | 'ios' | 'web';

export interface BundlerConfig {
  entryPoint: string;
  outfile: string;
  assetsDir: string;
  dev: boolean;
  minify: boolean;
  plugins?: Plugin[];
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

export interface PromiseHandler<Result> {
  task: Promise<Result>;
  resolver?: (val: Result) => void;
  rejecter?: (reason?: unknown) => void;
}
