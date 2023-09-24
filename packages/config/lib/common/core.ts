import { OptionFlag } from '../types';
import type { BundleConfig } from '../types';
import { DEFAULT_ENTRY_POINT, DEFAULT_OUTFILE } from '../shares';

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
