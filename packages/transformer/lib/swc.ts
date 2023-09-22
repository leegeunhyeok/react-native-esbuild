import {
  transform,
  minify,
  type Options,
  type JsMinifyOptions,
} from '@swc/core';
import { getSwcOptions } from '@react-native-esbuild/config';
import type { Transformer } from './types';

export const transformWithSwc: Transformer<Options> = async (
  code,
  context,
  customOptions,
) => {
  const options = getSwcOptions(
    {
      filename: context.path,
      root: context.root,
    },
    customOptions,
  );
  const { code: transformedCode } = await transform(code, options);

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};

export const minifyWithSwc: Transformer<JsMinifyOptions> = async (
  code,
  _context,
  customOptions,
) => {
  const { code: minifiedCode } = await minify(code, customOptions);

  if (typeof minifiedCode !== 'string') {
    throw new Error('swc minified source is empty');
  }

  return minifiedCode;
};
