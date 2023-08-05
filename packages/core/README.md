# `@react-native-esbuild/core`

> Core of @react-native-esbuild

## Usage

```ts
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

const bundler = new ReactNativeEsbuildBundler();

bundler
  .registerPlugin(/* call EsbuildPluginFactory */)
  .registerPlugin(/* call EsbuildPluginFactory */)
  .registerPlugin(/* call EsbuildPluginFactory */);

await bundler.bundle(bundleConfig);
await bundler.watch(bundleConfig);
```
