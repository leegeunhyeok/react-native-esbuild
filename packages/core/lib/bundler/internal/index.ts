/* eslint-disable quotes */
import fs from 'node:fs/promises';
import { minify as swcMinify } from '@swc/core';
import type { BundleConfig } from '@react-native-esbuild/config';
import { resolveFromRoot, wrapWithIIFE } from '../../helpers';
import { stripFlowWithSucrase } from '../transformers';

const cache: Record<'initialScripts', string | null> = {
  initialScripts: null,
};

const getNodeEnv = (dev: boolean): string =>
  dev ? 'development' : 'production';

const REACT_NATIVE_GET_POLYFILLS_PATH = 'react-native/rn-get-polyfills';
const REACT_NATIVE_INITIALIZE_CORE_PATH =
  'react-native/Libraries/Core/InitializeCore';

const getInjectVariables = (dev: boolean): string[] => [
  '__BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now()',
  `__METRO_GLOBAL_PREFIX__=''`,
  `__DEV__=${JSON.stringify(dev)}`,
  'process=this.process||{}',
  `global = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this`,
];

const getReactNativePolyfills = (root: string): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getPolyfills = require(resolveFromRoot(
    REACT_NATIVE_GET_POLYFILLS_PATH,
    root,
  )) as () => string[];

  return getPolyfills();
};

export const getReactNativeInitializeCore = (root: string): string => {
  return require.resolve(
    resolveFromRoot(REACT_NATIVE_INITIALIZE_CORE_PATH, root),
  );
};

export const getGlobalVariables = ({
  dev = true,
  platform,
}: BundleConfig): Record<string, string> => ({
  __DEV__: JSON.stringify(dev),
  global: platform === 'web' ? 'window' : 'globalThis',
  'process.env.NODE_ENV': JSON.stringify(getNodeEnv(dev)),
});

export const getInitializeScript = async (
  { dev = true, minify }: BundleConfig,
  root: string,
): Promise<string> => {
  if (!cache.initialScripts) {
    const polyfillScriptPaths = getReactNativePolyfills(root);

    const rawPolyfillCode = await Promise.all(
      polyfillScriptPaths.map((path) =>
        fs.readFile(path, { encoding: 'utf-8' }),
      ),
    );

    const polyfillScripts = await Promise.all(
      rawPolyfillCode.map(async (code, index): Promise<string> => {
        const path = polyfillScriptPaths[index].replace(root, '').slice(1);
        const transformContext = { root, path };
        const strippedCode = wrapWithIIFE(
          await stripFlowWithSucrase(code, transformContext),
          path,
        );
        return minify
          ? swcMinify(strippedCode, {
              compress: true,
              mangle: true,
              sourceMap: false,
            }).then(({ code }) => code)
          : strippedCode;
      }),
    );

    const initialScripts = [
      `var ${getInjectVariables(dev).join(',')};`,
      `process.env=process.env||{};`,
      `process.env.NODE_ENV=${JSON.stringify(getNodeEnv(dev))};`,
      ...polyfillScripts,
    ].join('\n');

    cache.initialScripts = initialScripts;
  }

  return cache.initialScripts;
};
