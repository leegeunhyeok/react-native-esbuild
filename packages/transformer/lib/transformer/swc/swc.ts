import {
  transform,
  transformSync,
  minify,
  type Options,
  type JsMinifyOptions,
  type TsParserConfig,
  type EsParserConfig,
} from '@swc/core';
import type {
  Transformer,
  SyncTransformer,
  TransformerContext,
} from '../../types';

const getParserOptions = (path: string): TsParserConfig | EsParserConfig => {
  return /\.tsx?$/.test(path)
    ? ({
        syntax: 'typescript',
        tsx: true,
        dynamicImport: true,
      } as TsParserConfig)
    : ({
        syntax: 'ecmascript',
        jsx: true,
        exportDefaultFrom: true,
      } as EsParserConfig);
};

const getSwcOptions = (
  context: TransformerContext,
  options?: Options,
): Options => {
  return {
    ...options,
    jsc: {
      parser: getParserOptions(context.path),
      ...options?.jsc,
    },
    filename: context.path,
    root: context.root,
  };
};

export const transformWithSwc: Transformer<Options> = async (
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

export const transformSyncWithSwc: SyncTransformer<Options> = (
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

export const minifyWithSwc: Transformer<JsMinifyOptions> = async (
  code,
  _context,
  options,
) => {
  const { code: minifiedCode } = await minify(code, options);

  if (typeof minifiedCode !== 'string') {
    throw new Error('swc minified source is empty');
  }

  return minifiedCode;
};
