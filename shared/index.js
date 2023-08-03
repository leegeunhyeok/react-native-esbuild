const path = require('node:path');

/**
 * @param {string} entryFile filename
 * @param {import('esbuild').BuildOptions} options additional options
 * @returns {import('esbuild').BuildOptions}
 */
exports.getEsbuildBaseOptions = (packageDir, options = {}) => ({
  entryPoints: [path.resolve(packageDir, '../lib/index.ts')],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  ...options,
  external: [
    'esbuild',
    'react-native/*',
    '@swc/*',
    '@babel/*',
    '@react-native-community/*',
    '@react-native-esbuild/*',
    ...(options.external || []),
  ],
});
