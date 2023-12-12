import type { Config } from 'jest';

const transform = {
  '^.+\\.(t|j)sx?$': '@swc/jest',
};

const config: Config = {
  projects: [
    {
      displayName: '@react-native-esbuild/cli',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/cli/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/config',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/config/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/core',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/core/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/dev-server',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/dev-server/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/plugins',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/plugins/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/symbolicate',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/symbolicate/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/transformer',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/transformer/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/shared',
      transform,
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/shared/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
  ],
  testPathIgnorePatterns: [
    'node_modules/',
    'docs/*',
    'example/*',
    '**/__tests__/*',
  ],
  collectCoverageFrom: ['packages/*/lib/**/*'],
};

export default config;
