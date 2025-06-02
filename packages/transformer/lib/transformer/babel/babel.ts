import {
  loadOptions,
  transformAsync,
  transformSync,
  transformFromAstAsync,
  transformFromAstSync,
  type TransformOptions,
  type Node,
} from '@babel/core';
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
  source,
  context,
  preset,
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = await transformAsync(source, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};

export const transformSyncWithBabel: SyncTransformer<TransformOptions> = (
  source,
  context,
  preset,
) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = transformSync(source, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};

export const transformWithBabelAst: AsyncTransformer<
  TransformOptions,
  Node
> = async (ast, context, preset) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = await transformFromAstAsync(ast, undefined, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};

export const transformSyncWithBabelAST: SyncTransformer<
  TransformOptions,
  Node
> = (ast, context, preset) => {
  const babelOptions = loadBabelOptions(context, preset?.(context));
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = transformFromAstSync(ast, undefined, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};
