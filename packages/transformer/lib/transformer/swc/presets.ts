import type { Options } from '@swc/core';
import type { SwcJestPresetOptions } from '../../types';

/**
 * swc transform options preset for react-native runtime.
 */
const getReactNativeRuntimeOptions = (): Options => ({
  minify: false,
  sourceMaps: false,
  isModule: true,
  inputSourceMap: false,
  inlineSourcesContent: false,
  jsc: {
    target: 'es5',
    loose: false,
    externalHelpers: true,
    keepClassNames: true,
  },
});

/**
 * swc transform options preset for jest.
 */
const getJestOptions = (options: SwcJestPresetOptions): Options => ({
  sourceMaps: 'inline',
  jsc: {
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
    experimental: {
      ...(options.experimental?.customCoverageInstrumentation
        ? {
            plugins: [
              [
                'swc-plugin-coverage-instrument',
                options.experimental.customCoverageInstrumentation,
              ],
            ],
          }
        : null),
    },
  },
  module: {
    type: options.module === 'esm' ? 'es6' : 'commonjs',
  },
});

export { getReactNativeRuntimeOptions, getJestOptions };
