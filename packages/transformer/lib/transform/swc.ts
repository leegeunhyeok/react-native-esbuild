import {
  transform,
  transformSync,
  minify,
  type Options,
  type TsParserConfig,
  type EsParserConfig,
} from '@swc/core';
import type {
  Transformer,
  SwcTransformerOptions,
  SwcMinifierOptions,
  SyncTransformer,
  TransformerContext,
} from '../types';

const getParserOptions = (
  isTypescript: boolean,
): TsParserConfig | EsParserConfig => {
  return isTypescript
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
  options?: SwcTransformerOptions,
): Options => {
  return {
    minify: false,
    sourceMaps: false,
    isModule: true,
    inputSourceMap: false,
    inlineSourcesContent: false,
    jsc: {
      parser: getParserOptions(/\.tsx?$/.test(context.path)),
      target: 'es5',
      loose: false,
      externalHelpers: true,
      keepClassNames: true,
    },
    // Override to custom options.
    ...options?.customOptions,
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
  const { code: minifiedCode } = await minify(code, options?.customOptions);

  if (typeof minifiedCode !== 'string') {
    throw new Error('swc minified source is empty');
  }

  return minifiedCode;
};
