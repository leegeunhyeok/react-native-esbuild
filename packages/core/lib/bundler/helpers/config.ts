import path from 'node:path';
import deepmerge from 'deepmerge';
import type { BuildOptions } from 'esbuild';
import {
  getDevServerPublicPath,
  type BundleOptions,
} from '@react-native-esbuild/config';
import type { BundleMode, Config } from '../../types';

export const loadConfig = (resolveDir: string): Config => {
  let config: Config | undefined;

  // Base config
  const baseConfig: Config = {
    cache: true,
    /**
     * mainFields
     * @see {@link https://github.com/facebook/metro/blob/0.72.x/docs/Configuration.md#resolvermainfields}
     */
    mainFields: ['react-native', 'browser', 'main', 'module'],
    logger: {
      disabled: false,
      timestamp: null,
    },
    transformer: {
      stripFlowPackageNames: ['react-native'],
    },
    web: {
      template: path.resolve(__filename, '../../static/templates/index.html'),
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
  Object.defineProperty(self, '_config', {
    value: config,
    writable: false,
  });

  return config;
};

export const getConfigFromGlobal = (): Config => {
  if (!self._config) {
    throw new Error('could not get configuration');
  }
  return self._config as Config;
};

export const getEsbuildWebConfig = (
  mode: BundleMode,
  root: string,
  bundleOptions: BundleOptions,
): BuildOptions => {
  return {
    format: 'iife',
    // cannot use both `outfile` and `outdir`
    outdir: mode === 'bundle' ? undefined : getDevServerPublicPath(root),
    outfile: mode === 'bundle' ? bundleOptions.outfile : undefined,
  };
};
