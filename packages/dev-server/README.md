# `@react-native-esbuild/dev-server`

> Development server for @react-native-esbuild

## Usage

```ts
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';

const { server, bundler } = new ReactNativeEsbuildDevServer({
  port: '8081',
  host: '127.0.0.1',
}).initialize();

server.listen();
```
