import { transform, transformSync, minify, type Options } from '@swc/core';
import type {
  Transformer,
  SwcTransformerOptions,
  SwcMinifierOptions,
  SyncTransformer,
  TransformerContext,
} from '../../types';
import * as presets from './presets';

const getSwcOptions = (
  context: TransformerContext,
  options?: SwcTransformerOptions,
): Options => {
  return {
    ...(options?.preset === 'jest'
      ? presets.getJestOptions(context)
      : presets.getReactNativeRuntimeOptions(context)),
    ...options?.overrideOptions,
    filename: context.path,
    root: context.root,
  };
};

export const transformWithSwc: Transformer<SwcTransformerOptions> = async (
  code,
  context,
  options,
) => {
  const { code: transformedCode } = await transform(
    code,
    getSwcOptions(context, options),
  );

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};

export const transformSyncWithSwc: SyncTransformer<SwcTransformerOptions> = (
  code,
  context,
  options,
) => {
  const { code: transformedCode } = transformSync(
    code,
    getSwcOptions(context, options),
  );

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};

export const minifyWithSwc: Transformer<SwcMinifierOptions> = async (
  code,
  _context,
  options,
) => {
  const { code: minifiedCode } = await minify(code, options?.overrideOptions);

  if (typeof minifiedCode !== 'string') {
    throw new Error('swc minified source is empty');
  }

  return minifiedCode;
};
