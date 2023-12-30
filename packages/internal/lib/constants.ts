/**
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/docs/Configuration.md#resolvermainfields}
 */
export const RESOLVER_MAIN_FIELDS = [
  'react-native',
  'browser',
  'main',
  'module',
];

/**
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/packages/metro-config/src/defaults/defaults.js}
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/packages/metro-file-map/src/workerExclusionList.js}
 */
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
