import type { EsbuildPresetOptions } from '@react-native-esbuild/config';

export interface BundleOptions extends EsbuildPresetOptions {
  outfile: string;
}

export interface BundleRequestOptions {
  platform: 'android' | 'ios' | 'web';
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
  NotStarted,
}

export interface PromiseHandler<Result> {
  task: Promise<Result>;
  resolver?: (val: Result) => void;
  rejecter?: (reason?: unknown) => void;
}
