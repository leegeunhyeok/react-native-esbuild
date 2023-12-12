import type { TransformOptions } from '@babel/core';
import { loadOptions, transformAsync, transformSync } from '@babel/core';
import type {
  AsyncTransformer,
  SyncTransformer,
  TransformerContext,
} from '../../types';

const loadBabelOptions = (
  context: TransformerContext,
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
  { context, moduleMeta, preset },
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context, moduleMeta));
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
  { context, moduleMeta, preset },
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context, moduleMeta));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = transformSync(code, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};
