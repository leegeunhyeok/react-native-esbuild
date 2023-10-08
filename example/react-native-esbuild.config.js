/**
 * @type {import('@react-native-esbuild/core').Config}
 */
exports.default = {
  cache: true,
  logger: {
    timestamp: 'YYYY-MM-DD HH:mm:ss.SSS',
  },
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
            plugins: [
              '@babel/plugin-transform-export-namespace-from',
              'react-native-reanimated/plugin',
            ],
            babelrc: false,
          },
        },
      ],
    },
  },
};
