---
title: Presets
sidebar_position: 1
slug: /package-presets
---

# Presets

If you are using 3rd party packages, follow the configuration below.
(apply configuration to `react-native-esbuild.config.js`)

> Can't find the package in the list? Please report the package information to [GitHub Issues](https://github.com/leegeunhyeok/react-native-esbuild/issues).

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

<details><summary>for Web</summary>

To build for web, follow the preset below ([Reference](https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support))

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
            plugins: [
              // add @babel/plugin-transform-export-namespace-from
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
```

</details>


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
