import deepmerge from 'deepmerge';
import type { TransformOptions } from '@babel/core';

export function getBabelOptions(
  customBabelOptions?: Partial<TransformOptions>,
): TransformOptions {
  const baseOptions: TransformOptions = {
    minified: false,
    compact: false,
    sourceMaps: false,
  };

  return customBabelOptions
    ? deepmerge(baseOptions, customBabelOptions)
    : baseOptions;
}
