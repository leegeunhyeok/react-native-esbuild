import { transform } from '@swc/core';
import { getSwcOptions } from '@react-native-esbuild/config';
import type { Transformer } from '../../types';

export const transformWithSwc: Transformer<void> = async (code, context) => {
  const options = getSwcOptions({
    filename: context.args.path,
    root: context.root,
  });
  const { code: transformedCode } = await transform(code, options);

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};
