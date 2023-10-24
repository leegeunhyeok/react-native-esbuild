import type { OnLoadArgs } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';

export type AsyncTransformer<TransformerOptions> = (
  code: string,
  context: TransformerContext,
  preset?: TransformerOptionsPreset<TransformerOptions>,
) => Promise<string>;

export type SyncTransformer<TransformerOptions> = (
  code: string,
  context: TransformerContext,
  preset?: TransformerOptionsPreset<TransformerOptions>,
) => string;

export interface TransformerContext {
  path: string;
  root: string;
}

export type TransformerOptionsPreset<TransformerOptions> = (
  context: TransformerContext,
) => TransformerOptions;

// swc preset options
export interface SwcReactNativeRuntimePresetOptions {
  reactRefresh?: { moduleId: string };
}

export interface SwcJestPresetOptions {
  module?: 'cjs' | 'esm';
  experimental?: {
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
  sharedData: SharedData,
) => Result;

export type AsyncTransformStep = TransformStep<Promise<TransformResult>>;
export type SyncTransformStep = TransformStep<TransformResult>;

export interface TransformResult {
  code: string;
  done: boolean;
}

export interface SharedData {
  hash?: string;
  mtimeMs?: number;
}
