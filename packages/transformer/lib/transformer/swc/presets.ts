import type {
  Options,
  JscConfig,
  TsParserConfig,
  EsParserConfig,
} from '@swc/core';
import type {
  TransformerOptionsPreset,
  SwcJestPresetOptions,
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
const getReactNativeRuntimePreset = (
  jscConfig?: Pick<JscConfig, 'transform' | 'experimental'>,
): TransformerOptionsPreset<Options> => {
  return (context) => ({
    minify: false,
    sourceMaps: false,
    isModule: true,
    inputSourceMap: false,
    inlineSourcesContent: false,
    jsc: {
      parser: getParserOptions(context.path),
      target: 'es5',
      loose: false,
      externalHelpers: true,
      keepClassNames: true,
      transform: jscConfig?.transform,
      experimental: jscConfig?.experimental,
    },
    filename: context.path,
    root: context.root,
  });
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

const getMinifyPreset = () => {
  return () => ({
    compress: true,
    mangle: true,
    sourceMap: false,
  });
};

export { getReactNativeRuntimePreset, getJestPreset, getMinifyPreset };
