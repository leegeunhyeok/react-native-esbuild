import { transform } from '@swc/core';
import type { OnLoadArgs } from 'esbuild';
import { getSwcOptions } from '@react-native-esbuild/config';

export const transformWithSwc = async (
  source: string,
  args: OnLoadArgs,
  root: string,
): Promise<string> => {
  const options = getSwcOptions({ filename: args.path, root });
  const { code } = await transform(source, options);

  if (typeof code !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return code;
};
