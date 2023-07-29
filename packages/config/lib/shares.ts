/* eslint-disable quotes */
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
  // JSONs are never haste modules, except for "package.json", which is handled.
  '.json',

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

export const BANNER_VARS = [
  '__BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now()',
  `__DEV__=${String(true)}`,
  'process=this.process||{}',
  `__METRO_GLOBAL_PREFIX__=''`,
  `window = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this`,
];
