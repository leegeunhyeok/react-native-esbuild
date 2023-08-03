# `@react-native-esbuild/core`

> Core of @react-native-esbuild

## Usage

```ts
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

const bundler = new ReactNativeEsbuildBundler({
  entryPoint: 'index.js';
  outfile: 'dist/main.jsbundle';
  assetsDir: 'dist/assets';
  dev: true;
  minify: false;
});

bundler.registerPlugins((config, bundlerConfig) => {
  return [
    // esbuild plugins here
  ];
});

await bundler.bundle(platform);
await bundler.watch(platform);
```
