const path = require('node:path');
const esbuild = require('esbuild');

/** @type { import('esbuild').BuildOptions } */
const options = {
  entryPoints: [path.resolve(__dirname, '../lib/index.ts')],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  external: ['react-native*'],
};

esbuild
  .build(options)
  .then(() => console.log('success'))
  .catch(console.error);
