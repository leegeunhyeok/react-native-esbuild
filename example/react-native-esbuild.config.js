/**
 * @type {import('@react-native-esbuild/config').CoreConfig}
 */
exports.default = {
  cache: true,
  transform: {
    fullyTransformPackageNames: ['react-native', 'react-native-reanimated'],
    svgr: true,
  },
};
