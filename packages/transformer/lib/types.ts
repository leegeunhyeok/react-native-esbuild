import type { Stats } from 'node:fs';
import type { OnLoadArgs } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';

export type AsyncTransformer<TransformerOptions> = (
  code: string,
  config: TransformerConfig<TransformerOptions>,
) => Promise<string>;

export type SyncTransformer<TransformerOptions> = (
  code: string,
  config: TransformerConfig<TransformerOptions>,
) => string;

interface TransformerConfig<TransformerOptions> {
  context: TransformerContext;
  moduleMeta?: ModuleMeta;
  preset?: TransformerOptionsPreset<TransformerOptions>;
}

export interface TransformerContext {
  id: number;
  root: string;
  entry: string;
  dev: boolean;
  path: string;
}

export type TransformerOptionsPreset<TransformerOptions> = (
  context: TransformerContext,
  moduleMeta?: ModuleMeta,
) => TransformerOptions;

export interface ReactNativeRuntimePresetOptions {
  /**
   * Options for experimental features.
   */
  experimental?: {
    /**
     * HMR(Hot Module Replacement) options.
     *
     * If `undefined`, HMR will be disabled.
     */
    hmr?: {
      /**
       * `runtimeModule` option in `swc-plugin-global-module`.
       *
       * @see github {@link https://github.com/leegeunhyeok/swc-plugin-global-module}
       */
      runtime: boolean;
      refreshReg: string;
      refreshSig: string;
    };
  };
}

export interface SwcJestPresetOptions {
  module?: 'cjs' | 'esm';
  experimental?: {
    /**
     * Option for Jest compatibility.
     *
     * Using swc to transform code to comply with the ESM specification,
     * but Jest to test it in a CJS environment, may encounter issues
     * due to the immutable issue of exports.
     *
     * To avoid the issue, enable option.
     * It will be transformed exports with add `configurable: true`.
     *
     * Defaults to `true`
     *
     * @see {@link https://github.com/swc-project/swc/discussions/5151}
     */
    mutableCjsExports?: boolean;
    /**
     * @see {@link https://github.com/kwonoj/swc-plugin-coverage-instrument}
     */
    customCoverageInstrumentation?: {
      coverageVariable?: string;
      compact?: boolean;
      reportLogic?: boolean;
      ignoreClassMethods?: string[];
      instrumentLog?: { level: string; enableTrace: boolean };
    };
  };
}

export interface SwcMinifyPresetOptions {
  minify: boolean;
}

export interface TransformRuleBase<T> {
  /**
   * Predicator for transform
   */
  test: (path: string, code: string) => boolean;
  /**
   * Transformer options
   */
  options: T | ((path: string, code: string) => T);
}

export type BabelTransformRule = TransformRuleBase<BabelTransformOptions>;
export type SwcTransformRule = TransformRuleBase<SwcTransformOptions>;

// TransformPipelineBuilder
export type TransformStep<Result> = (
  code: string,
  args: OnLoadArgs,
  moduleMeta: ModuleMeta,
) => Result;

export type AsyncTransformStep = TransformStep<Promise<TransformResult>>;
export type SyncTransformStep = TransformStep<TransformResult>;

export interface TransformResult {
  code: string;
  done: boolean;
}

export interface ModuleMeta {
  hash: string;
  stats: Stats;
  externalPattern?: string;
  importPaths?: Record<string, string>;
}
