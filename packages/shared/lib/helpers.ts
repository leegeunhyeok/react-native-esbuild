import path from 'node:path';
import md5 from 'md5';
import { OptionFlag } from './enums';
import type { BundleOptions, Id } from './types/core';
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTFILE,
  LOCAL_CACHE_DIR,
  PUBLIC_PATH,
  STATUS_CACHE_FILE,
} from './constants';

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
 * Generate hash that contains the file path, modification time, and bundle options.
 *
 * `id` is combined(platform, dev, minify) bundle options value in `@react-native-esbuild`.
 *
 * hash = md5(id + modified time + file path + core version)
 *            number + number    + string    + string
 *
 * @param id - id
 * @param filepath - file path
 * @param modifiedAt - file modified at timestamp
 * @returns
 */
export const getCacheKey = (
  id: Id,
  filepath: string,
  modifiedAt: number,
): string => {
  return md5(id + modifiedAt + filepath + (self._version as string));
};

/**
 * For resolve environment mismatch issue.
 *
 * Run bundler with `--dev=false` (production), but babel's env is still using `development` environment.
 * In this case, run bundle after build it will be occurs unexpected errors.
 *
 * For eg. `react-native-reanimated` using babel plugin for transform.
 *         Plugin follows babel environment, but main source(by esbuild) isn't.
 *
 * Override `NODE_ENV`, `BABEL_ENV` to bundler's environment.
 *
 * @param isDev - env is 'development'
 * @see {@link https://github.com/babel/babel/blob/v7.23.0/packages/babel-core/src/config/helpers/environment.ts#L2}
 */
export const setEnvironment = (isDev: boolean): void => {
  const env = isDev ? 'development' : 'production';
  process.env.NODE_ENV = env;
  process.env.BABEL_ENV = env;
};

export const getDevServerPublicPath = (root: string): string => {
  return path.resolve(root, LOCAL_CACHE_DIR, PUBLIC_PATH);
};

export const getBuildStatusCachePath = (root: string): string => {
  return path.resolve(root, LOCAL_CACHE_DIR, STATUS_CACHE_FILE);
};
