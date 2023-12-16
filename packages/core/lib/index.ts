import pkg from '../package.json';

// Set core version to global.
self._version = pkg.version;

export { ReactNativeEsbuildBundler } from './bundler';
export type * from './types';
export type * from './bundler';
export type { CacheController } from './bundler/cache';
