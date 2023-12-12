import path from 'node:path';
import type { BuildOptions } from 'esbuild';
import deepmerge from 'deepmerge';
import {
  RESOLVER_MAIN_FIELDS,
  SOURCE_EXTENSIONS,
  ASSET_EXTENSIONS,
} from '@react-native-esbuild/internal';
import {
  getDevServerPublicPath,
  type BundleOptions,
} from '@react-native-esbuild/config';
import { logger } from '../../shared';
import type { BundleMode, Config } from '../../types';

export const loadConfig = (configFilePath?: string): Config => {
  let config: Config | undefined;

  // Base config
  const baseConfig: Config = {
    cache: true,
    logger: {
      disabled: false,
      timestamp: null,
    },
    resolver: {
      mainFields: RESOLVER_MAIN_FIELDS,
      sourceExtensions: SOURCE_EXTENSIONS,
      assetExtensions: ASSET_EXTENSIONS,
    },
    transformer: {
      stripFlowPackageNames: ['react-native'],
    },
    web: {
      template: path.resolve(__filename, '../../static/templates/index.html'),
    },
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires -- Config file may not exist.
    config = require(
      configFilePath
        ? path.resolve(configFilePath)
        : path.resolve(process.cwd(), 'react-native-esbuild.config.js'),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Config will be default exported.
    ).default;
  } catch (error) {
    /**
     * Could not resolve configuration file.
     * Fallback to default configuration.
     */
    logger.warn('could not resolve configuration file');
    logger.debug('configuration load error', error as Error);
    logger.nl();
  }

  config = config
    ? deepmerge(baseConfig, config, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- `deepmerge` isn't well typed.
        arrayMerge: (_destinationArray, sourceArray) => sourceArray,
      })
    : baseConfig;

  // Assign config to global context.
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
    /**
     * Cannot use both `outfile` and `outdir`.
     *
     * - bundle mode: `outfile`
     * - watch mode:`outdir`
     */
    outdir: mode === 'bundle' ? undefined : getDevServerPublicPath(root),
    outfile: mode === 'bundle' ? bundleOptions.outfile : undefined,
  };
};
