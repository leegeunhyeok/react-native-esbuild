import type { BuildContext, Plugin } from 'esbuild';
import type {
  ReactNativeEsbuildConfig,
  BundleConfig,
} from '@react-native-esbuild/config';

export type BundleMode = 'bundle' | 'watch';
export type InternalCaller = 'dev-server';

export interface BuildTask {
  context: BuildContext;
  handler: PromiseHandler<BundleResult> | null;
  status: 'pending' | 'resolved';
  buildCount: number;
}

export interface BundleResult {
  source: Uint8Array;
  sourcemap: Uint8Array;
  bundledAt: Date;
  revisionId: string;
}

export enum BundleTaskSignal {
  EmptyOutput,
}

export type EsbuildPluginFactory<PluginConfig = void> = (
  config?: PluginConfig,
) => (context: PluginContext) => Plugin;

export type BundlerAdditionalData = Record<string, unknown>;

export interface PluginContext extends BundleConfig {
  id: number;
  root: string;
  config: ReactNativeEsbuildConfig;
  mode: BundleMode;
  additionalData?: BundlerAdditionalData;
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

export type Transformer<Options> = (
  code: string,
  context: { path: string; root: string },
  customOption?: Options,
) => string | Promise<string>;
