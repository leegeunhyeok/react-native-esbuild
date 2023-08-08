import {
  loadOptions,
  transform,
  type TransformOptions,
  type BabelFileResult,
} from '@babel/core';
import type { OnLoadArgs } from 'esbuild';
import { getBabelOptions } from '@react-native-esbuild/config';
import { promisify } from '../../../utils';

export const transformWithBabel = async (
  source: string,
  args: OnLoadArgs,
  customOptions?: TransformOptions,
): Promise<string> => {
  const options = loadOptions({
    ...getBabelOptions(customOptions),
    filename: args.path,
    caller: {
      name: '@react-native-esbuild/plugins',
    },
  });

  if (!options) {
    throw new Error('cannot load babel options');
  }

  const { code } = await promisify<BabelFileResult>((handler) =>
    transform(source, options, handler),
  );

  if (typeof code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return code;
};
