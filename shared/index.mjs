import * as path from 'node:path';

/**
 * @param {string} entryFile filename
 * @param {import('esbuild').BuildOptions} options additional options
 * @returns {import('esbuild').BuildOptions}
 */
export function getEsbuildBaseOptions(packageDir, options = {}) {
  return {
    entryPoints: [path.resolve(packageDir, '../lib/index.ts')],
    outfile: 'dist/index.js',
    bundle: true,
    format: 'esm',
    platform: 'node',
    packages: 'external',
    ...options,
  };
}
