/**
 * @type {import('@react-native-esbuild/config').CoreConfig}
 */
exports.default = {
  transform: {
    svgr: true,
    stripFlowPackageNames: ['react-native'],
    fullyTransformPackageNames: [],
    customTransformRules: [
      {
        test: (path, source) => {
          return (
            /node_modules\/react-native-reanimated\//.test(path) ||
            source.includes('react-native-reanimated')
          );
        },
        plugins: ['react-native-reanimated/plugin'],
      },
    ],
  },
};
