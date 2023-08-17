/* eslint-disable quotes */
import path from 'node:path';

const getNodeEnv = (dev: boolean): string =>
  dev ? 'development' : 'production';

export const REACT_NATIVE_INITIALIZE_CORE_MODULE =
  'react-native/Libraries/Core/InitializeCore';

export const getInjectVariables = (dev: boolean): string[] => [
  '__BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now()',
  'process=this.process||{}',
  'process.env=process.env||{}',
  `process.env.NODE_ENV=${JSON.stringify(getNodeEnv(dev))}`,
  `__METRO_GLOBAL_PREFIX__=''`,
  `window = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this`,
];

export const getGlobalVariables = (dev: boolean): Record<string, string> => ({
  __DEV__: JSON.stringify(dev),
  global: 'window',
  'process.env.NODE_ENV': JSON.stringify(getNodeEnv(dev)),
});

export const getReactNativePolyfills = (): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const getPolyfills = require(require.resolve(
    'react-native/rn-get-polyfills',
    {
      paths: Array.from(
        new Set([
          // add current workspace directory to module resolution path.
          // improve for workspace projects (eg. monorepo)
          path.join(process.cwd(), 'node_modules'),
          ...(require.main?.paths ?? []),
        ]),
      ).filter(Boolean),
    },
  )) as () => string[];

  return getPolyfills();
};
