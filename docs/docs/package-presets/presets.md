---
title: Presets
sidebar_position: 1
slug: /package-presets
---

# Presets for packages

If you are using the package, follow the configuration below.
(apply preset configuration to `react-native-esbuild.config.js`)

> Can't find the package in the list? Please leave the package information in an [issue](https://github.com/leegeunhyeok/react-native-esbuild/issues).

## @gorhom/bottom-sheet

```js
exports.default = {
  transformer: {
    fullyTransformPackageNames: ['@gorhom/bottom-sheet'],
  },
};
```

## @react-native-community/datetimepicker

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['@react-native-community/datetimepicker'],
  },
};
```

## react-native-google-publisher-tag

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-google-publisher-tag'],
  },
};
```

## react-native-modal-datetime-picker

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-modal-datetime-pick'],
  },
};
```

## react-native-reanimated

```js
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

## react-native-scrollable-tab-view

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-scrollable-tab-view'],
  },
};
```


## react-native-video

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-video'],
  },
};
```

## rn-fetch-blob

```js
exports.default = {
  transformer: {
    stripFlowPackageNames: ['rn-fetch-blob'],
  },
};
```
