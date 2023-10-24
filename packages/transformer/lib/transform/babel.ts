import { loadOptions, transformAsync } from '@babel/core';
import type { Transformer, BabelTransformerOptions } from '../types';

export const transformWithBabel: Transformer<BabelTransformerOptions> = async (
  code: string,
  context,
  options,
) => {
  const babelOptions = loadOptions({
    minified: false,
    compact: false,
    sourceMaps: false,
    babelrc: options?.fullyTransform ?? false,
    highlightCode: !process.stdin.isTTY,
    // Override to custom options.
    ...options?.customOptions,
    root: context.root,
    filename: context.path,
  });

  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = await transformAsync(code, babelOptions);

  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};
