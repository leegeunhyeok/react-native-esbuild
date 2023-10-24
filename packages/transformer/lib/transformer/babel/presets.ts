import type { TransformOptions } from '@babel/core';
import type { TransformerOptionsPreset } from '../../types';

const getCommonPreset = (): TransformerOptionsPreset<TransformOptions> => {
  return (_context) => ({
    minified: false,
    compact: false,
    sourceMaps: false,
    babelrc: false,
    highlightCode: !process.stdin.isTTY,
  });
};

const getFullyTransformPreset =
  (): TransformerOptionsPreset<TransformOptions> => {
    return (context) => ({
      root: context.root,
      babelrc: true,
    });
  };

export { getCommonPreset, getFullyTransformPreset };
