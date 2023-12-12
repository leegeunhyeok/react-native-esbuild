import pkg from '../package.json';

// Set core version to global.
self._version = pkg.version;

export { ReactNativeEsbuildBundler } from './bundler';
export type { Config } from '@react-native-esbuild/shared';
export type * from './bundler/events';
export type * from './types';
