import type { TransformOptions } from '@babel/core';

const getCommon = (): TransformOptions => ({
  minified: false,
  compact: false,
  sourceMaps: false,
  babelrc: false,
  highlightCode: !process.stdin.isTTY,
});

export { getCommon };
