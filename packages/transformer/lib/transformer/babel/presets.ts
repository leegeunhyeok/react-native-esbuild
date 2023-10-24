import type { TransformOptions } from '@babel/core';
import type { BabelTransformerOptions, TransformerContext } from '../../types';

const getCommon = (
  context: TransformerContext,
  options?: BabelTransformerOptions,
): TransformOptions => ({
  minified: false,
  compact: false,
  sourceMaps: false,
  babelrc: options?.fullyTransform ?? false,
  highlightCode: !process.stdin.isTTY,
  ...options?.overrideOptions,
  root: context.root,
  filename: context.path,
});

export { getCommon };
