export const DEFAULT_ENTRY_POINT = 'index.js';
export const DEFAULT_OUTFILE = 'main.jsbundle';
export const DEFAULT_ASSETS_DIR = 'assets';

export const GLOBAL_CACHE_DIR = 'react-native-esbuild';
export const LOCAL_CACHE_DIR = '.rne';

export const SUPPORT_PLATFORMS = ['android', 'ios', 'web'] as const;

// asset extensions
// https://github.com/facebook/metro/blob/0.72.x/packages/metro-config/src/defaults/defaults.js
// https://github.com/facebook/metro/blob/0.72.x/packages/metro-file-map/src/workerExclusionList.js
export const SOURCE_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
];

export const IMAGE_EXTENSIONS = [
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.tiff',
  '.tif',
  '.webp',
];

export const ASSET_EXTENSIONS = [
  // Video extensions.
  '.avi',
  '.mp4',
  '.mpeg',
  '.mpg',
  '.ogv',
  '.webm',
  '.3gp',
  '.3g2',

  // Audio extensions.
  '.aac',
  '.midi',
  '.mid',
  '.mp3',
  '.oga',
  '.wav',
  '.3gp',
  '.3g2',

  // Font extensions.
  '.eot',
  '.otf',
  '.ttf',
  '.woff',
  '.woff2',

  // Image extensions.
  ...IMAGE_EXTENSIONS,
];
