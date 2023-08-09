# Configurations

- [@gorhom/bottom-sheet](#gorhombottom-sheet)
- [@react-native-community/datetimepicker](#react-native-communitydatetimepicker)
- [react-native-google-publisher-tag](#react-native-google-publisher-tag)
- [react-native-modal-datetime-picker](#react-native-modal-datetime-picker)
- [react-native-reanimated](#react-native-reanimated)
- [react-native-scrollable-tab-view](#react-native-scrollable-tab-view)
- [react-native-video](#react-native-video)
- [rn-fetch-blob](#rn-fetch-blob)

## @gorhom/bottom-sheet

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    fullyTransformPackageNames: [..., '@gorhom/bottom-sheet'],
  },
};
```

## @react-native-community/datetimepicker

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      '@react-native-community/datetimepicker',
    ],
  },
};
```

## react-native-google-publisher-tag

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      'react-native-google-publisher-tag',
    ],
  },
};
```

## react-native-modal-datetime-picker

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      'react-native-modal-datetime-pick',
    ],
  },
};
```

## react-native-reanimated

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    customTransformRules: [
      ...,
      {
        test: (path, source) => {
          return (
            /node_modules\/react-native-reanimated\//.test(path) ||
            source.includes('react-native-reanimated')
          );
        },
        plugins: ['react-native-reanimated/plugin'],
      },
    ],
  },
};
```

## react-native-scrollable-tab-view

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      'react-native-scrollable-tab-view',
    ],
  },
};
```


## react-native-video

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      'react-native-video',
    ],
  },
};
```

## rn-fetch-blob

```js
// <project-root>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/config').ReactNativeEsbuildConfig}
 */
exports.default = {
  transform: {
    ...,
    stripFlowPackageNames: [
      ...,
      'rn-fetch-blob',
    ],
  },
};
```
