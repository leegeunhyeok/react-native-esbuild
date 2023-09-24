import type { BuildContext, Plugin } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';
import type { BundleConfig } from '@react-native-esbuild/config';

export interface ReactNativeEsbuildConfig {
  /**
   * Enable cache.
   *
   * Defaults to `true`
   */
  cache?: boolean;
  /**
   * Field names for resolve package's modules.
   *
   * Defaults to `['react-native', 'browser', 'main', 'module']`
   *
   * @see Documentation {@link https://esbuild.github.io/api/#main-fields}
   */
  mainFields?: string[];
  /**
   * transform configurations
   */
  transformer?: {
    /**
     * If `true`, convert svg assets to `react-native-svg` based component
     */
    convertSvg?: boolean;
    /**
     * Strip flow syntax.
     *
     * Defaults to `['react-native']`
     */
    stripFlowPackageNames?: string[];
    /**
     * Transform with babel using `metro-react-native-babel-preset` (slow)
     */
    fullyTransformPackageNames?: string[];
    /**
     * Additional transform rules. This rules will be applied before phase of transform to es5.
     */
    additionalTransformRules?: {
      /**
       * Custom Babel rules
       */
      babel?: CustomTransformRuleBase<BabelTransformOptions>[];
      /**
       * Custom Swc rules
       */
      swc?: CustomTransformRuleBase<SwcTransformOptions>[];
    };
  };
}

interface CustomTransformRuleBase<T> {
  /**
   * Predicator for transform
   */
  test: (path: string, code: string) => boolean;
  /**
   * Transformer options
   */
  options: T | ((path: string, code: string) => T);
}

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

export type BundleRequestConfig = Partial<
  Pick<BundleConfig, 'dev' | 'minify'>
> &
  Pick<BundleConfig, 'platform'> & {
    runModule: boolean;
  };

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
