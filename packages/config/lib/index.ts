import deepmerge from 'deepmerge';
import type { BuildOptions } from 'esbuild';
import type { TransformOptions } from '@babel/core';
import type {
  Options as SwcOptions,
  TsParserConfig,
  EsParserConfig,
} from '@swc/core';
import { SOURCE_EXTENSIONS, ASSET_EXTENSIONS, BANNER_VARS } from './shares';
import type { EsbuildPresetOptions, SwcPresetOptions } from './types';

function getESbuildOptions(
  options: EsbuildPresetOptions,
  customEsbuildOptions?: Partial<BuildOptions>,
): BuildOptions {
  const { entryPoints, outfile, platform, dev } = options;

  const platforms = [platform, 'native', 'react-native'];
  const extensions = SOURCE_EXTENSIONS.concat(ASSET_EXTENSIONS);

  const getReactNativePolyfills = (): string[] => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getPolyfills = require(require.resolve(
      'react-native/rn-get-polyfills',
    )) as () => string[];

    return getPolyfills();
  };

  const baseOptions: BuildOptions = {
    /**
     * mainFields
     * @see {@link https://github.com/facebook/metro/blob/0.72.x/docs/Configuration.md#resolvermainfields}
     */
    mainFields: ['react-native', 'browser', 'main', 'module'],
    entryPoints,
    outfile,
    sourceRoot: process.cwd(),
    minify: !dev,
    resolveExtensions: platforms
      .map((platform) => extensions.map((ext) => `.${platform}${ext}`))
      .concat(extensions)
      .flat(),
    define: {
      __DEV__: JSON.stringify(dev),
      global: 'window',
      'process.env.NODE_ENV': JSON.stringify(
        dev ? 'development' : 'production',
      ),
    },
    loader: Object.fromEntries(ASSET_EXTENSIONS.map((ext) => [ext, 'file'])),
    legalComments: 'none',
    banner: {
      js: `var ${BANNER_VARS.join(',')};`,
    },
    inject: [
      ...getReactNativePolyfills(),
      'react-native/Libraries/Core/InitializeCore',
    ],
    target: 'es6',
    supported: {
      // to avoid block scope bug on hermes engine.
      // in `__copyProps`, generated by esbuild
      'for-of': false,
    },
    format: 'iife',
    bundle: true,
    sourcemap: true,
  };

  return deepmerge(baseOptions, customEsbuildOptions ?? {});
}

function getBabelOptions(
  customBabelOptions?: Partial<TransformOptions>,
): TransformOptions {
  const baseOptions: TransformOptions = {
    minified: false,
    compact: false,
    sourceMaps: false,
  };

  return customBabelOptions
    ? deepmerge(baseOptions, customBabelOptions)
    : baseOptions;
}

function getSwcOptions(
  options: SwcPresetOptions,
  customSwcOptions?: Partial<SwcOptions>,
): SwcOptions {
  const isTS = /\.tsx?$/.test(options.filename);
  const parseOption = isTS
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

  const baseOptions: SwcOptions = {
    isModule: true,
    sourceMaps: false,
    jsc: {
      parser: parseOption,
      target: 'es5',
      loose: true,
      externalHelpers: true,
      keepClassNames: true,
    },
  };

  return customSwcOptions
    ? deepmerge(baseOptions, customSwcOptions)
    : baseOptions;
}

export { getESbuildOptions, getBabelOptions, getSwcOptions };
export * from './shares';
export type * from './types';
