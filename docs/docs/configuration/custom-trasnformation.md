---
title: Custom Transformation
sidebar_position: 2
slug: /configuration/custom-transformation
---

# Custom Transform

## Babel

Add transform rules to `transformer.additionalTransformRules.babel`.

```ts
// react-native-esbuild.config.js
exports.default = {
  transformer: {
    additionalTransformRules: {
      babel: [
        {
          /**
           * @param path file path
           * @param code raw source code
           * @returns true: transform, false: do not transform
           **/
          test: (path: string, code: string) => {
            return shouldApplyTransformation;
          },
          /**
           * Babel options
           **/
          options: babelOptions,
          // it can be function that return babel options.
          options: (path: string, code: string) => babelOptions,
        },
      ],
    },
  },
};
```

## Swc

Add transform rules to `transformer.additionalTransformRules.swc`.

```ts
// react-native-esbuild.config.js
exports.default = {
  transformer: {
    additionalTransformRules: {
      swc: [
        {
          /**
           * @param path file path
           * @param code raw source code
           * @returns true: transform, false: do not transform
           **/
          test: (path: string, code: string) => {
            return shouldApplyTransformation;
          },
          /**
           * Swc options
           **/
          options: swcOptions,
          // it can be function that return swc options.
          options: (path: string, code: string) => swcOptions,
        },
      ],
    },
  },
};
```

## Usage

```js
// react-native-esbuild.config.js
exports.default = {
  transformer: {
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
```

