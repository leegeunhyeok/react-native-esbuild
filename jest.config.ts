import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  projects: [
    {
      displayName: '@react-native-esbuild/cli',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/cli/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/config',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/config/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/core',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/core/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/dev-server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/dev-server/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/plugins',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/plugins/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/source-map',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/source-map/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/utils',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/utils/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
  ],
  testPathIgnorePatterns: ['<rootDir>/example'],
};

// eslint-disable-next-line import/no-default-export
export default config;
