import path from 'node:path';
import deepmerge from 'deepmerge';
import { OptionFlag } from '../types';
import type { BundleConfig, ReactNativeEsbuildConfig } from '../types';
import { DEFAULT_ENTRY_POINT, DEFAULT_OUTFILE } from '../shares';

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

  return config
    ? deepmerge(baseConfig, config, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- deepmerge typing
        arrayMerge: (_destinationArray, sourceArray) => sourceArray,
      })
    : baseConfig;
}

export function combineWithDefaultBundleConfig(
  options: Partial<BundleConfig>,
): BundleConfig {
  if (!options.platform) {
    throw new Error('platform is required');
  }

  return {
    ...options,
    platform: options.platform,
    minify: options.minify ?? false,
    dev: options.dev ?? true,
    entry: options.entry ?? DEFAULT_ENTRY_POINT,
    outfile: options.outfile ?? DEFAULT_OUTFILE,
    metafile: options.metafile ?? false,
  };
}

export function getIdByOptions({
  platform,
  dev,
  minify,
}: Pick<BundleConfig, 'platform' | 'dev' | 'minify'>): number {
  let value = OptionFlag.None; // = 0

  // platform
  value |= platform === 'android' ? OptionFlag.PlatformAndroid : 0;
  value |= platform === 'ios' ? OptionFlag.PlatformIos : 0;
  value |= platform === 'web' ? OptionFlag.PlatformWeb : 0;

  // dev & minify
  value |= dev ? OptionFlag.Dev : 0;
  value |= minify ? OptionFlag.Minify : 0;

  return value;
}

export function setEnvironment(isDev: boolean): void {
  const env = isDev ? 'development' : 'production';
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
}
