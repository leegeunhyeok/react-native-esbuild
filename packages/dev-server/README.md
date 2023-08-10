# `@react-native-esbuild/dev-server`

> Development server for @react-native-esbuild

## Usage

```ts
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';

const { server, bundler } = new ReactNativeEsbuildDevServer({
  port: '8081',
  host: 'localhost',
}).initialize();

bundler
  .registerPlugin(/* plugin */)
  .registerPlugin(/* plugin */)
  .registerPlugin(/* plugin */);

server.listen();
```
