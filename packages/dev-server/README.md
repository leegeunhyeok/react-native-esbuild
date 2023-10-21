# `@react-native-esbuild/dev-server`

> Development server for @react-native-esbuild

## Usage

```ts
import {
  ReactNativeAppServer,
  ReactNativeWebServer,
} from '@react-native-esbuild/dev-server';

const serveOptions = {
  port: '8081',
  host: 'localhost',
};

// For Native (Android, iOS)
const server = await new ReactNativeAppServer(
  serveOptions,
).initialize((bundler) => {
  bundler
    .registerPlugin(/* plugin */)
    .registerPlugin(/* plugin */)
    .registerPlugin(/* plugin */);
});

// For Web
const server = await new ReactNativeWebServer(
  serveOptions,
  bundleOptions,
).initialize((bundler) => {
  bundler
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin())
    .registerPlugin(createReactNativeWebPlugin());
});

server.listen(() => console.log('listening!'));
```
