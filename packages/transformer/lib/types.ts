import type { OnLoadArgs } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type {
  Options as SwcTransformOptions,
  JsMinifyOptions as SwcJsMinifyOptions,
} from '@swc/core';

export type Transformer<Options> = (
  code: string,
  context: TransformerContext,
  options?: Options,
) => Promise<string>;

export interface TransformerContext {
  path: string;
  root: string;
}

export interface BabelTransformerOptions {
  fullyTransform?: boolean;
  customOptions?: BabelTransformOptions;
}

export interface SwcTransformerOptions {
  customOptions?: SwcTransformOptions;
}

export interface SwcMinifierOptions {
  customOptions?: SwcJsMinifyOptions;
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
export type TransformStep = (
  code: string,
  args: OnLoadArgs,
  sharedData: SharedData,
) => Promise<TransformResult> | TransformResult;

interface TransformResult {
  code: string;
  done: boolean;
}

export interface SharedData {
  hash?: string;
  mtimeMs?: number;
}
