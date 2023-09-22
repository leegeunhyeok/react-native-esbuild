/* eslint-disable quotes -- allow using backtick */
import fs from 'node:fs/promises';
import type { BundleConfig } from '@react-native-esbuild/config';
import { resolveFromRoot, wrapWithIIFE } from './helpers';

const REACT_NATIVE_GET_POLYFILLS_PATH = 'react-native/rn-get-polyfills';
const REACT_NATIVE_INITIALIZE_CORE_PATH =
  'react-native/Libraries/Core/InitializeCore';

const getNodeEnv = (dev: boolean): string =>
  dev ? 'development' : 'production';

/**
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/lib/getPreludeCode.js}
 */
export const getInjectVariables = (dev: boolean): string[] => [
  '__BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now()',
  `__METRO_GLOBAL_PREFIX__=''`,
  `__DEV__=${JSON.stringify(dev)}`,
  'process=this.process||{}',
  `global = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this`,
];

const getReactNativePolyfills = (root: string): Promise<string[]> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- should dynamic require
  const getPolyfills = require(
    resolveFromRoot(REACT_NATIVE_GET_POLYFILLS_PATH, root),
  ) as () => string[];

  return Promise.all(
    getPolyfills().map((scriptPath) =>
      fs
        .readFile(scriptPath, { encoding: 'utf-8' })
        .then((code) => wrapWithIIFE(code, scriptPath)),
    ),
  );
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
  global: platform === 'web' ? 'window' : 'global',
  'process.env.NODE_ENV': JSON.stringify(getNodeEnv(dev)),
});

export const getPreludeScript = async (
  { dev = true }: BundleConfig,
  root: string,
): Promise<string> => {
  const polyfills = await getReactNativePolyfills(root);
  const initialScripts = [
    `var ${getInjectVariables(dev).join(',')};`,
    `process.env=process.env||{};`,
    `process.env.NODE_ENV=${JSON.stringify(getNodeEnv(dev))};`,
    ...polyfills,
  ].join('\n');

  return initialScripts;
};
