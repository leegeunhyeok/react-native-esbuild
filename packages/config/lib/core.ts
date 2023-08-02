import deepmerge from 'deepmerge';
import type { CoreOptions } from './types';

export const CACHE_DIR = 'rne';
export const LOCAL_CACHE_DIR = '.rne';

export function getCoreOptions(options?: CoreOptions): CoreOptions {
  const baseOptions: CoreOptions = {
    cache: true,
    transform: {},
  };

  return options ? deepmerge(baseOptions, options) : baseOptions;
}
