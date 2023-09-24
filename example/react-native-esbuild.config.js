/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  cache: true,
  timestampFormat: '',
  transformer: {
    convertSvg: true,
    stripFlowPackageNames: ['react-native'],
    fullyTransformPackageNames: [],
    additionalTransformRules: {
      babel: [
        {
          test: (path, code) => {
            return (
              /node_modules\/react-native-reanimated\//.test(path) ||
              code.includes('react-native-reanimated')
            );
          },
          options: {
            plugins: ['react-native-reanimated/plugin'],
            babelrc: false,
          },
        },
      ],
    },
  },
};
