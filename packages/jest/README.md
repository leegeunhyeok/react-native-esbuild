# `@react-native-esbuild/jest`

> react-native preset for jest powered by @react-native-esbuild

## Usage

```js
exports.default = {
  preset: 'react-native',
  transform: {
    '^.+\\.(t|j)sx?$': '@react-native-esbuild/jest',
  },
};

// With transformer options(for enable custom instrument).
exports.default = {
  preset: 'react-native',
  transform: {
    '^.+\\.(t|j)sx?$': ['@react-native-esbuild/jest', /* TransformerConfig */],
  },
};
```

```ts
/**
 * @see {@link https://github.com/kwonoj/swc-plugin-coverage-instrument}
 */
interface TransformerConfig {
  experimental?: {
    customCoverageInstrumentation?: {
      coverageVariable?: string;
      compact: boolean;
      reportLogic: boolean;
      ignoreClassMethods: string[];
      instrumentLog?: {
        level: string;
        enableTrace: boolean;
      };
    };
  };
}
```
