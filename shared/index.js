const path = require('node:path');

/**
 * @param {string} packageDir build script directory
 * @param {import('esbuild').BuildOptions} options additional options
 * @returns {import('esbuild').BuildOptions}
 */
const getEsbuildBaseOptions = (packageDir, options = {}) => ({
  entryPoints: [path.join(getPackageRoot(packageDir), 'lib/index.ts')],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  packages: 'external',
  ...options,
});

/**
 * @param {string} packageDir build script directory
 * @returns package root path
 */
const getPackageRoot = (packageDir) => path.resolve(packageDir, '../');

exports.getEsbuildBaseOptions = getEsbuildBaseOptions;
exports.getPackageRoot = getPackageRoot;
