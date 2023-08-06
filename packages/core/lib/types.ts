import type { BuildContext, Plugin } from 'esbuild';
import type {
  ReactNativeEsbuildConfig,
  BundleConfig,
  BundlerSupportPlatform,
} from '@react-native-esbuild/config';

export type RunType = 'bundle' | 'watch';

export interface BuildTask {
  context: BuildContext;
  handler: PromiseHandler<BundleResult> | null;
  status: 'pending' | 'resolved';
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
  EmptyOutput,
}

export type EsbuildPluginFactory<PluginConfig = void> = (
  config?: PluginConfig,
) => (context: PluginContext) => Plugin;

export interface PluginContext extends BundleConfig {
  taskId: number;
  cwd: string;
  mode: RunType;
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
