import { loadOptions, transformAsync, transformSync } from '@babel/core';
import type {
  Transformer,
  SyncTransformer,
  BabelTransformerOptions,
  TransformerContext,
} from '../../types';

const loadBabelOptions = (
  context: TransformerContext,
  options?: BabelTransformerOptions,
): ReturnType<typeof loadOptions> => {
  return loadOptions({
    minified: false,
    compact: false,
    sourceMaps: false,
    babelrc: options?.fullyTransform ?? false,
    highlightCode: !process.stdin.isTTY,
    // Override to custom options.
    ...options?.overrideOptions,
    root: context.root,
    filename: context.path,
  });
};

export const transformWithBabel: Transformer<BabelTransformerOptions> = async (
  code: string,
  context,
  options,
) => {
  const babelOptions = loadBabelOptions(context, options);
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = await transformAsync(code, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};

export const transformSyncWithBabel: SyncTransformer<
  BabelTransformerOptions
> = (code: string, context, options) => {
  const babelOptions = loadBabelOptions(context, options);
  if (!babelOptions) {
    throw new Error('cannot load babel options');
  }

  const result = transformSync(code, babelOptions);
  if (typeof result?.code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return result.code;
};
