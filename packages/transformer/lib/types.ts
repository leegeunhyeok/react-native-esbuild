import type { OnLoadArgs } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';

export type Transformer<Options> = (
  code: string,
  context: TransformerContext,
  options?: Options,
) => Promise<string>;

export type SyncTransformer<Options> = (
  code: string,
  context: TransformerContext,
  options?: Options,
) => string;

export interface TransformerContext {
  path: string;
  root: string;
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
