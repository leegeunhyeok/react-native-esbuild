import {
  transform,
  transformSync,
  minify,
  type Options,
  type JsMinifyOptions,
} from '@swc/core';
import type { AsyncTransformer, SyncTransformer } from '../../types';

export const transformWithSwc: AsyncTransformer<Options> = async (
  code,
  context,
  preset,
) => {
  const { code: transformedCode } = await transform(code, preset?.(context));

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};

export const transformSyncWithSwc: SyncTransformer<Options> = (
  code,
  context,
  preset,
) => {
  const { code: transformedCode } = transformSync(code, preset?.(context));

  if (typeof transformedCode !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return transformedCode;
};

export const minifyWithSwc: AsyncTransformer<JsMinifyOptions> = async (
  code,
  context,
  preset,
) => {
  const { code: minifiedCode } = await minify(code, preset?.(context));

  if (typeof minifiedCode !== 'string') {
    throw new Error('swc minified source is empty');
  }

  return minifiedCode;
};
