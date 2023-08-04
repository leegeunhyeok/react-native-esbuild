/**
 * @type {import('@react-native-esbuild/config').CoreConfig}
 */
exports.default = {
  cache: true,
  transform: {
    svgr: true,
    stripFlowPackageNames: ['react-native', 'react-native-reanimated'],
    fullyTransformPackageNames: [],
    customTransformRules: [
      {
        test: (_path, source) => {
          return source.includes('react-native-reanimated');
        },
        plugins: ['react-native-reanimated/plugin'],
      },
    ],
  },
};
