const esbuild = require('esbuild');
const { getEsbuildBaseOptions } = require('../../../shared');

const buildOptions = getEsbuildBaseOptions(__dirname, {
  external: [
    '@babel/*',
    '@react-native-esbuild/*',
    '@swc/*',
    'esbuild',
    'react-native/*',
  ],
});

esbuild.build(buildOptions).catch((error) => {
  console.error(error);
  process.exit(-1);
});
