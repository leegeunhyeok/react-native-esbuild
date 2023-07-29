const esbuild = require('esbuild');
const { getEsbuildBaseOptions } = require('../../../shared');

const buildOptions = getEsbuildBaseOptions(__dirname);

esbuild.build(buildOptions).catch(console.error);
