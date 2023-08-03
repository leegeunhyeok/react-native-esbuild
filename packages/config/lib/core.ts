import path from 'node:path';
import deepmerge from 'deepmerge';
import type { CoreConfig } from './types';

export const CACHE_DIR = 'rne';
export const LOCAL_CACHE_DIR = '.rne';

export function loadConfig(): CoreConfig {
  let config: CoreConfig | undefined;

  const baseOptions: CoreConfig = {
    cache: true,
    transform: {},
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    config = require(path.resolve(
      process.cwd(),
      'react-native-esbuild.config.js',
    )).default;
  } catch {
    // empty
  }

  return config ? deepmerge(baseOptions, config) : baseOptions;
}
