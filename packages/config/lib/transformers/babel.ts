import deepmerge from 'deepmerge';
import type { TransformOptions } from '@babel/core';

export const getBabelOptions = (
  rootDir: string,
  customBabelOptions?: Partial<TransformOptions>,
): TransformOptions => {
  const baseOptions: TransformOptions = {
    minified: false,
    compact: false,
    sourceMaps: false,
    root: rootDir,
  };

  return customBabelOptions
    ? deepmerge(baseOptions, customBabelOptions)
    : baseOptions;
};
