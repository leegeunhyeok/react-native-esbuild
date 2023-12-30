import type { TransformOptions } from '@babel/core';
import { loadOptions, transformAsync, transformSync } from '@babel/core';
import type { TransformContext } from '@react-native-esbuild/shared';
import type { AsyncTransformer, SyncTransformer } from '../../types';

const loadBabelOptions = (
  context: TransformContext,
  options?: TransformOptions,
): ReturnType<typeof loadOptions> => {
  return loadOptions({
    ...options,
    root: context.root,
    filename: context.path,
  });
};

export const transformWithBabel: AsyncTransformer<TransformOptions> = async (
  code: string,
  { context, preset },
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = await transformAsync(code, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};

export const transformSyncWithBabel: SyncTransformer<TransformOptions> = (
  code: string,
  { context, preset },
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = transformSync(code, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};
