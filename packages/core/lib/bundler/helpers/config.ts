import path from 'node:path';
import deepmerge from 'deepmerge';
import type { ReactNativeEsbuildConfig } from '../../types';

export function loadConfig(resolveDir: string): ReactNativeEsbuildConfig {
  let config: ReactNativeEsbuildConfig | undefined;

  // Base config
  const baseConfig: ReactNativeEsbuildConfig = {
    cache: true,
    /**
     * mainFields
     * @see {@link https://github.com/facebook/metro/blob/0.72.x/docs/Configuration.md#resolvermainfields}
     */
    mainFields: ['react-native', 'browser', 'main', 'module'],
    transformer: {
      stripFlowPackageNames: ['react-native'],
    },
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires -- config file may not exist
    config = require(
      path.resolve(resolveDir, 'react-native-esbuild.config.js'),
    ).default;
  } catch {
    // could not resolve configuration file
  }

  config = config
    ? deepmerge(baseConfig, config, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- deepmerge typing
        arrayMerge: (_destinationArray, sourceArray) => sourceArray,
      })
    : baseConfig;

  // assign config to global context
  self._config = config;

  return config;
}

export function getConfig(): ReactNativeEsbuildConfig {
  if (!self._config) {
    throw new Error('could not get configuration');
  }
  return self._config as ReactNativeEsbuildConfig;
}
