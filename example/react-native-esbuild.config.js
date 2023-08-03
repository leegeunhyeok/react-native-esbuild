/**
 * @type {import('@react-native-esbuild/config').CoreOptions}
 */
exports.default = {
  cache: true,
  transform: {
    fullyTransformPackageNames: ['react-native', 'react-native-reanimated'],
  },
};
