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
      displayName: '@react-native-esbuild/config',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/config/**/*.test.ts'],
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
      displayName: '@react-native-esbuild/internal',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/internal/**/*.test.ts'],
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
      displayName: '@react-native-esbuild/symbolicate',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/symbolicate/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    },
    {
      displayName: '@react-native-esbuild/transformer',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/transformer/**/*.test.ts'],
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
  testPathIgnorePatterns: ['node_modules/', 'example/*', '**/__tests__/*'],
  collectCoverageFrom: ['packages/*/lib/**/*'],
};

export default config;
