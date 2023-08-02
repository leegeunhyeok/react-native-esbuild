import path from 'node:path';
import { LOCAL_CACHE_DIR } from './core';

export const ASSET_PATH = '/assets';

export const getDevServerAssetPath = (): string => {
  return path.resolve(process.cwd(), LOCAL_CACHE_DIR, 'assets');
};
