import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';

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
