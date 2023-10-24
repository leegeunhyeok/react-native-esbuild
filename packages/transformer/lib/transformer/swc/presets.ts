import type { Options, TsParserConfig, EsParserConfig } from '@swc/core';
import type { TransformerContext } from '../../types';

const getParserOptions = (
  context: TransformerContext,
): TsParserConfig | EsParserConfig => {
  return /\.tsx?$/.test(context.path)
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

/**
 * swc transform options preset for react-native runtime.
 */
const getReactNativeRuntimeOptions = (
  context: TransformerContext,
): Options => ({
  minify: false,
  sourceMaps: false,
  isModule: true,
  inputSourceMap: false,
  inlineSourcesContent: false,
  jsc: {
    parser: getParserOptions(context),
    target: 'es5',
    loose: false,
    externalHelpers: true,
    keepClassNames: true,
  },
  filename: context.path,
  root: context.root,
});

/**
 * swc transform options preset for jest.
 */
const getJestOptions = (context: TransformerContext): Options => ({
  sourceMaps: 'inline',
  jsc: {
    parser: getParserOptions(context),
    target: 'es2022',
    transform: {
      /**
       * @see {@link https://github.com/swc-project/jest/blob/v0.2.29/index.ts#L119}
       */
      // @ts-expect-error -- swc sugar code
      hidden: {
        jest: true,
      },
      react: {
        runtime: 'automatic',
      },
    },
  },
  module: { type: 'commonjs' },
  filename: context.path,
  root: context.root,
});

export { getReactNativeRuntimeOptions, getJestOptions };
