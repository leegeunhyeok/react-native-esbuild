# `@react-native-esbuild/core`

> Core of @react-native-esbuild

## Usage

```ts
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

// Must be called first
ReactNativeEsbuildBundler.bootstrap();

const bundler = new ReactNativeEsbuildBundler();

bundler
  .addPlugin(/* call ReactNativeEsbuildPluginCreator */)
  .addPlugin(/* call ReactNativeEsbuildPluginCreator */)
  .addPlugin(/* call ReactNativeEsbuildPluginCreator */);

// initialize bundler
await bundler.initialize();

// using `esbuild.build()` (write output to file system)
await bundler.bundle(bundleOptions);

// using `esbuild.context()` (in-memory output for dev-server)
await bundler.getBundleResult(bundleOptions);
```
