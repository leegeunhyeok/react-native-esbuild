const esbuild = require('esbuild');
const { getEsbuildBaseOptions } = require('../../../shared');

const buildOptions = getEsbuildBaseOptions(__dirname, 'index.ts');

esbuild.build(buildOptions).catch(console.error);
