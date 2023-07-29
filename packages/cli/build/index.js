const path = require('node:path');
const esbuild = require('esbuild');

/** @type { import('esbuild').BuildOptions } */
const options = {
  entryPoints: [
    path.resolve(__dirname, '../lib/cli.ts'),
  ],
  outfile: 'dist/cli.js',
  banner: {
    js: '#!/bin/node',
  },
  bundle: true,
  platform: 'node',
};

esbuild.build(options)
  .then(() => console.log('success'))
  .catch(console.error);
