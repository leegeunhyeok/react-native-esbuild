import type { OnLoadArgs } from 'esbuild';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';
import type { ModuleId } from './core';

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

export interface BaseTransformContext {
  root: string;
  entry: string;
  dev: boolean;
}

export interface ScopedTransformContext {
  id: ModuleId;
  path: string;
  /**
   * @internal
   *
   * - react-native-runtime-transform-plugin: `mtimeMs`, `hash`, `externalPattern`, `isEntryPoint`
   * - HMRTransformer: `externalPattern`
   *
   * ```ts
   * interface PluginData {
   *   // Set modified at timestamp.
   *   mtimeMs?: number;
   *   // Set hash value when cache enabled.
   *   hash?: string;
   *   // Set map value when HMR enabled.
   *   moduleIds?: Record<string, string>;
   *   // Set `true` when transform for HMR update.
   *   isRuntimeModule?: boolean;
   *   // Set `true` if it's entry-point module.
   *   isEntryPoint?: boolean;
   * }
   * ```
   */
  pluginData: OnLoadArgs['pluginData'];
}

export type TransformContext = BaseTransformContext & ScopedTransformContext;
