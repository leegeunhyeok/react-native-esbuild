import path from 'node:path';
import { LOCAL_CACHE_DIR } from '../shares';

export const ASSET_PATH = 'assets';

export const getDevServerAssetPath = (root: string): string => {
  return path.resolve(root, LOCAL_CACHE_DIR, ASSET_PATH);
};
