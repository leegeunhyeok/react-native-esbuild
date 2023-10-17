import path from 'node:path';
import { OptionFlag } from '../types';
import type { BundleOptions } from '../types';
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTFILE,
  LOCAL_CACHE_DIR,
} from '../shares';

export const combineWithDefaultBundleOptions = (
  options: Partial<BundleOptions>,
): BundleOptions => {
  if (!options.platform) {
    throw new Error('platform is required');
  }

  return {
    ...options,
    platform: options.platform,
    minify: options.minify ?? false,
    dev: options.dev ?? true,
    entry: path.resolve(options.entry ?? DEFAULT_ENTRY_POINT),
    outfile: path.resolve(options.outfile ?? DEFAULT_OUTFILE),
    metafile: options.metafile ?? false,
  };
};

export const getIdByOptions = ({
  platform,
  dev,
  minify,
}: Pick<BundleOptions, 'platform' | 'dev' | 'minify'>): number => {
  let value = OptionFlag.None; // = 0

  // platform
  value |= platform === 'android' ? OptionFlag.PlatformAndroid : 0;
  value |= platform === 'ios' ? OptionFlag.PlatformIos : 0;
  value |= platform === 'web' ? OptionFlag.PlatformWeb : 0;

  // dev & minify
  value |= dev ? OptionFlag.Dev : 0;
  value |= minify ? OptionFlag.Minify : 0;

  return value;
};

/**
 * helper for resolve environment mismatch issue.
 *
 * run bundler with `production` environment, but babel's env is still `development`.
 * in this case, run bundle after build it will be occurs unexpected errors.
 *
 * for eg. `react-native-reanimated` using babel plugin for transform.
 *         it follow babel environment, but main source(by esbuild) isn't.
 *
 * @see {@link https://github.com/babel/babel/blob/v7.23.0/packages/babel-core/src/config/helpers/environment.ts#L2}
 */
export const setEnvironment = (isDev: boolean): void => {
  const env = isDev ? 'development' : 'production';
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
};

export const ASSET_PATH = 'assets';
export const PUBLIC_PATH = 'public';
export const STATUS_CACHE_FILE = 'build-status.json';

export const getDevServerPublicPath = (root: string): string => {
  return path.resolve(root, LOCAL_CACHE_DIR, PUBLIC_PATH);
};

export const getBuildStatusCachePath = (root: string): string => {
  return path.resolve(root, LOCAL_CACHE_DIR, STATUS_CACHE_FILE);
};
