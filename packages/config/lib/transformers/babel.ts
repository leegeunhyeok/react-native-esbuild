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
    highlightCode: !process.stdin.isTTY,
  };

  return customBabelOptions
    ? deepmerge(baseOptions, customBabelOptions)
    : baseOptions;
};
