/* eslint-disable quotes -- Allow using backtick */
import fs from 'node:fs/promises';
import type { BundleOptions } from '@react-native-esbuild/config';
import { resolveFromRoot, wrapWithIIFE } from './helpers';
import type { Asset } from './types';

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
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- Allow dynamic require.
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
}: BundleOptions): Record<string, string> => ({
  __DEV__: JSON.stringify(dev),
  global: platform === 'web' ? 'window' : 'global',
  'process.env.NODE_ENV': JSON.stringify(getNodeEnv(dev)),
});

export const getPreludeScript = async (
  { dev = true }: BundleOptions,
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
/**
 * Get asset registration script.
 *
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/Bundler/util.js#L29-L57}
 * @see {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/Image/RelativeImageStub.js}
 */
export const getAssetRegistrationScript = ({
  name,
  type,
  scales,
  hash,
  httpServerLocation,
  dimensions,
}: Pick<
  Asset,
  'name' | 'type' | 'scales' | 'hash' | 'httpServerLocation' | 'dimensions'
>): string => {
  return `
    module.exports = require('react-native/Libraries/Image/AssetRegistry').registerAsset(${JSON.stringify(
      {
        __packager_asset: true,
        name,
        type,
        scales,
        hash,
        httpServerLocation,
        width: dimensions.width,
        height: dimensions.height,
      },
    )});
  `;
};

/**
 * Get reload script.
 *
 * @see turboModuleProxy {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/TurboModule/TurboModuleRegistry.js#L17}
 * @see nativeModuleProxy {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/BatchedBridge/NativeModules.js#L179}
 *
 * ```ts
 * // It works the same as the code below.
 * import { DevSettings } from 'react-native';
 *
 * DevSettings.reload();
 * ```
 */
export const getReloadByDevSettingsProxy = (): string => `(function () {
  var moduleName = "DevSettings";
  (global.__turboModuleProxy
    ? global.__turboModuleProxy(moduleName)
    : global.nativeModuleProxy[moduleName]).reload();
})();`;
