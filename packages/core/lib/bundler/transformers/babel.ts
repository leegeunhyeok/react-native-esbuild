import {
  loadOptions,
  transform,
  type TransformOptions,
  type BabelFileResult,
} from '@babel/core';
import { getBabelOptions } from '@react-native-esbuild/config';
import { promisify } from '../../helpers';
import type { Transformer } from '../../types';

export const transformWithBabel: Transformer<TransformOptions> = async (
  code: string,
  context,
  customOptions,
) => {
  const options = loadOptions({
    ...getBabelOptions(context.root, customOptions),
    filename: context.args.path,
    caller: {
      name: '@react-native-esbuild/plugins',
    },
  });

  if (!options) {
    throw new Error('cannot load babel options');
  }

  const { code: transformedCode } = await promisify<BabelFileResult>(
    (handler) => transform(code, options, handler),
  );

  if (typeof transformedCode !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return transformedCode;
};
