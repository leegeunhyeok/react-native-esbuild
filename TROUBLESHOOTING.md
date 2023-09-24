# Troubleshooting

- [On Build Time](#on-build-time)
- [On Runtime](#on-runtime)
- [Configurations for 3rd Party Libraries](#configurations-for-3rd-party-libraries)
- [New Architecture](#new-architecture)

## On Build Time

- Try build with `--reset-cache` flag
- When `Syntax Error` occurs
  - Target library may be using [Flow](https://flow.org) for type checking.
  - Add the package name to `stripFlowPackageNames` in configuration file.
- When unknown error occurs
  - Add target package name to `fullyTransformPackageNames` in configuration file.
- Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.

## On Runtime

> [!WARNING]  
> It's hard to determine the cause (too many reasons).
> 
> Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.

## Configurations for 3rd Party Libraries

> [!NOTE]  
> If you're using packages below and you've some build issues, follow the configurations.

- [@gorhom/bottom-sheet](#gorhombottom-sheet)
- [@react-native-community/datetimepicker](#react-native-communitydatetimepicker)
- [react-native-google-publisher-tag](#react-native-google-publisher-tag)
- [react-native-modal-datetime-picker](#react-native-modal-datetime-picker)
- [react-native-reanimated](#react-native-reanimated)
- [react-native-scrollable-tab-view](#react-native-scrollable-tab-view)
- [react-native-video](#react-native-video)
- [rn-fetch-blob](#rn-fetch-blob)

### @gorhom/bottom-sheet

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    fullyTransformPackageNames: ['@gorhom/bottom-sheet'],
  },
};
```

### @react-native-community/datetimepicker

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['@react-native-community/datetimepicker'],
  },
};
```

### react-native-google-publisher-tag

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-google-publisher-tag'],
  },
};
```

### react-native-modal-datetime-picker

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-modal-datetime-pick'],
  },
};
```

### react-native-reanimated

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
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

### react-native-scrollable-tab-view

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-scrollable-tab-view'],
  },
};
```


### react-native-video

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['react-native-video'],
  },
};
```

### rn-fetch-blob

```js
// <rootDir>/react-native-esbuild.config.js

/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {
  transformer: {
    stripFlowPackageNames: ['rn-fetch-blob'],
  },
};
```

## New Architecture

> [!WARNING]  
> [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) is experimental.

### Reanimated 

> ReferenceError: Property 'nativeFabricUIManager' doesn't exist

- Some [issue](https://github.com/leegeunhyeok/react-native-esbuild/issues/16#issuecomment-1730042378) on `react-native-reanimated` + `Fabric`
- To resolve(temporary solution), open `node_modules/react-native-reanimated/src/reanimated2/fabricUtils.ts` and change `react-native/Libraries/Renderer/shims/ReactFabric` to inline lazy require.

```diff
let findHostInstance_DEPRECATED: (ref: React.Component) => HostInstance;
- if (global._IS_FABRIC) {
-   try {
-     findHostInstance_DEPRECATED =
-     // eslint-disable-next-line @typescript-eslint/no-var-requires
-     require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
-   } catch (e) {
-     throw new Error(
-       '[Reanimated] Cannot import `findHostInstance_DEPRECATED`.'
-     );
-   }
- }

export function getShadowNodeWrapperFromRef(
  ref: React.Component
): ShadowNodeWrapper {
+ if (global._IS_FABRIC && !findHostInstance_DEPRECATED) {
+   try {
+     findHostInstance_DEPRECATED =
+     // eslint-disable-next-line @typescript-eslint/no-var-requires
+     require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
+   } catch (e) {
+     throw new Error(
+       '[Reanimated] Cannot import `findHostInstance_DEPRECATED`.'
+     );
+   }
+ }
  return findHostInstance_DEPRECATED(ref)._internalInstanceHandle.stateNode
    .node;
}
```
