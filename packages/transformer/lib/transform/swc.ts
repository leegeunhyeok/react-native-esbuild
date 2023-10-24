import {
  transform,
  minify,
  type TsParserConfig,
  type EsParserConfig,
} from '@swc/core';
import type {
  Transformer,
  SwcTransformerOptions,
  SwcMinifierOptions,
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

export const transformWithSwc: Transformer<SwcTransformerOptions> = async (
  code,
  context,
  options,
) => {
  const { code: transformedCode } = await transform(code, {
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
  });

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
