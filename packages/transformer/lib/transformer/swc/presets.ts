import type {
  Options,
  JscConfig,
  TsParserConfig,
  EsParserConfig,
} from '@swc/core';
import type {
  TransformerOptionsPreset,
  ReactNativeRuntimePresetOptions,
  SwcJestPresetOptions,
  ModuleMeta,
  SwcMinifyPresetOptions,
  TransformerContext,
} from '../../types';

/**
 * TODO: move into hmr package.
 *
 * @see `HmrTransformer.isBoundary`
 */
const isHMRBoundary = (path: string): boolean => {
  return !path.includes('/node_modules/') && !path.endsWith('runtime.js');
};

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

const getSwcExperimental = (
  context: TransformerContext,
  moduleMeta?: ModuleMeta,
  options?: ReactNativeRuntimePresetOptions,
): JscConfig['experimental'] => {
  if (options?.experimental?.hmr && isHMRBoundary(context.path)) {
    return {
      plugins: [
        [
          'swc-plugin-global-module',
          {
            runtimeModule: options.experimental.hmr.runtime,
            externalPattern: moduleMeta?.externalPattern,
            importPaths: moduleMeta?.importPaths,
          },
        ],
      ],
    };
  }
  return undefined;
};

/**
 * swc transform options preset for react-native runtime.
 */
const getReactNativeRuntimePreset = (
  options?: ReactNativeRuntimePresetOptions,
): TransformerOptionsPreset<Options> => {
  return (context, moduleMeta) => ({
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
          // @ts-expect-error -- wrong type definition.
          refresh:
            options?.experimental?.hmr && isHMRBoundary(context.path)
              ? {
                  refreshReg: options.experimental.hmr.refreshReg,
                  refreshSig: options.experimental.hmr.refreshSig,
                }
              : undefined,
        },
      },
      experimental: getSwcExperimental(context, moduleMeta, options),
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
