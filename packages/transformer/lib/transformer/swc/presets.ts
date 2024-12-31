import type { Options, TsParserConfig, EsParserConfig } from '@swc/core';
import {
  REACT_REFRESH_GET_SIGNATURE_FUNCTION,
  REACT_REFRESH_REGISTER_FUNCTION,
} from '@react-native-esbuild/hmr';
import globalModulePlugin, { Phase } from '@global-modules/swc-plugin';
import type {
  TransformerOptionsPreset,
  SwcJestPresetOptions,
  SwcMinifyPresetOptions,
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

/**
 * swc transform options preset for react-native runtime.
 */
const getReactNativeRuntimePreset = (): TransformerOptionsPreset<Options> => {
  return (context) => {
    return {
      minify: false,
      sourceMaps: false,
      isModule: true,
      inputSourceMap: false,
      inlineSourcesContent: false,
      jsc: {
        parser: getParserOptions(context.path),
        target: 'es5',
        loose: false,
        externalHelpers: !context.dev,
        keepClassNames: true,
        transform: {
          react: {
            development: context.dev,
            refresh: {
              refreshReg: REACT_REFRESH_REGISTER_FUNCTION,
              refreshSig: REACT_REFRESH_GET_SIGNATURE_FUNCTION,
            } as unknown,
          },
        },
        experimental: {
          plugins: [
            [globalModulePlugin, { id: context.id, phase: Phase.Bundle }],
          ],
        },
      },
      filename: context.path,
      root: context.root,
    } as Options;
  };
};

const getJestPreset = (
  options: SwcJestPresetOptions,
): TransformerOptionsPreset<Options> => {
  const plugins = [
    options.experimental?.mutableCjsExports ?? true
      ? ['swc_mut_cjs_exports', {}]
      : null,
    options.experimental?.customCoverageInstrumentation
      ? [
          'swc-plugin-coverage-instrument',
          options.experimental.customCoverageInstrumentation,
        ]
      : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- swc type
  ].filter(Boolean) as [string, Record<string, any>][];

  return (context) => ({
    sourceMaps: 'inline',
    jsc: {
      parser: getParserOptions(context.path),
      target: 'es2022',
      transform: {
        /**
         * @see {@link https://github.com/swc-project/jest/blob/v0.2.29/index.ts#L119}
         */
        hidden: {
          jest: true,
        },
        react: {
          runtime: 'automatic',
          development: context.dev,
          refresh: false,
        },
      },
      experimental: {
        plugins,
      },
    },
    module: {
      type: options.module === 'esm' ? 'es6' : 'commonjs',
    },
    filename: context.path,
    root: context.root,
  });
};

const getMinifyPreset = ({
  minify,
}: SwcMinifyPresetOptions): TransformerOptionsPreset<Options> => {
  return (context) => ({
    minify,
    inputSourceMap: false,
    inlineSourcesContent: false,
    jsc: {
      parser: getParserOptions(context.path),
      target: 'es5',
      loose: false,
      keepClassNames: true,
    },
    filename: context.path,
    root: context.root,
  });
};

export { getReactNativeRuntimePreset, getJestPreset, getMinifyPreset };
