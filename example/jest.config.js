const TRANSFORM_PACKAGES = [
  'react-native',
  'jest-react-native',
  '@react-native',
  '@react-native-community',
  '@react-navigation',
  '@expo/html-elements',
  'dripsy',
];

/**
 * @type {import('jest').Config}
 */
export default {
  preset: 'react-native',
  transform: {
    '^.+\\.(t|j)sx?$': '@react-native-esbuild/jest',
  },
  transformIgnorePatterns: [
    `node_modules/(?!${TRANSFORM_PACKAGES.join('|')})/`,
  ],
  testPathIgnorePatterns: ['dist'],
  coveragePathIgnorePatterns: ['node_modules'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
  ],
  setupFilesAfterEnv: ['./tests/setup.ts'],
};
