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

// using `esbuild.build()` (write output to file system)
await bundler.bundle(bundleOptions);

// using `esbuildContext.watch()` (in-memory output for dev-server)
await bundler.getBundle(bundleOptions);
```
