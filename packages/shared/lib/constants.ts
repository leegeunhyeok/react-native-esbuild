import path from 'node:path';
import os from 'node:os';

export const DEFAULT_ENTRY_POINT = 'index.js';
export const DEFAULT_WEB_ENTRY_POINT = 'index.web.js';
export const DEFAULT_OUTFILE = 'main.jsbundle';

export const LOCAL_CACHE_DIR = '.rne';
export const GLOBAL_CACHE_DIR = path.join(os.tmpdir(), 'react-native-esbuild');

export const SUPPORT_PLATFORMS = ['android', 'ios', 'web'] as const;

export const ASSET_PATH = 'assets';
export const PUBLIC_PATH = 'public';
export const STATUS_CACHE_FILE = 'build-status.json';
