import deepmerge from 'deepmerge';
import type { CoreOptions } from './types';

export function getCoreOptions(options?: CoreOptions): CoreOptions {
  const baseOptions: CoreOptions = {
    cache: true,
    transform: {},
  };

  return options ? deepmerge(baseOptions, options) : baseOptions;
}
