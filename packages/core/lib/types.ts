import type { EsbuildPresetOptions } from '@react-native-esbuild/config';

export type Platform = 'android' | 'ios' | 'web';

export interface BundleOptions extends EsbuildPresetOptions {
  outfile: string;
}

export interface BundleRequestOptions {
  platform: Platform;
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
}

export interface PromiseHandler<Result> {
  task: Promise<Result>;
  resolver?: (val: Result) => void;
  rejecter?: (reason?: unknown) => void;
}
