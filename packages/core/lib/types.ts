import type { Stats } from 'node:fs';
import type { BuildContext as EsbuildBuildContext } from 'esbuild';
import type { BuildContext, BundleOptions } from '@react-native-esbuild/shared';

export interface BundlerInitializeOptions {
  watcherEnabled?: boolean;
}

export interface BuildTask {
  context: BuildContext;
  esbuild: EsbuildBuildContext;
  delegate: BuildTaskDelegate;
  buildCount: number;
  status: 'pending' | 'resolved';
}

export interface BuildTaskDelegate {
  promise: Promise<BundleResult>;
  success: (val: BundleResult) => void;
  failure: (reason?: unknown) => void;
}

export type BundleResult = BundleSuccessResult | BundleFailureResult;

export interface BundleSuccessResult {
  result: {
    source: Uint8Array;
    sourcemap: Uint8Array;
    bundledAt: Date;
    revisionId: string;
  };
  error: null;
}

export interface BundleFailureResult {
  result: null;
  error: Error;
}

export interface BundleRequestOptions {
  entry?: BundleOptions['entry'];
  dev?: BundleOptions['dev'];
  minify?: BundleOptions['minify'];
  platform: BundleOptions['platform'];
  runModule: boolean;
}

// Watcher
export interface FileSystemWatchEventListener {
  onFileSystemChange: (
    event: string,
    path: string,
    stats: Stats | undefined,
  ) => void;
}
