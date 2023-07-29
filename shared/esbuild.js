const path = require('node:path');

/**
 * @param {string} entryFile filename
 * @param {import('esbuild').BuildOptions} options additional options
 * @returns {import('esbuild').BuildOptions}
 */
exports.getEsbuildBaseOptions = (packageDir, entryFile, options = {}) => ({
  entryPoints: [path.resolve(packageDir, `../lib/${entryFile}`)],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  ...options,
});
