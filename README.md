<div align="center">

  # react-native-esbuild

  > ⚡️ An extremely fast bundler + React Native

  ![banner](./main.png)

  [![esbuild](https://img.shields.io/badge/esbuild-ffcf00?logo=esbuild&logoColor=black&style=flat-square)](https://esbuild.github.io)
  [![swc](https://img.shields.io/badge/swc-e47700?logo=swc&logoColor=white&style=flat-square)](https://swc.rs)
  [![react native](https://img.shields.io/badge/react--native-61dafb?logo=react&logoColor=white&style=flat-square)](https://reactnative.dev)
  [![build system](https://img.shields.io/badge/lerna-9333ea?logo=lerna&logoColor=white&style=flat-square)](https://lerna.js.org)
  [![build system](https://img.shields.io/badge/nx-143055?logo=nx&logoColor=white&style=flat-square)](https://nx.dev)


  [![typescript](https://img.shields.io/badge/typescript-3178c6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
  [![code style](https://img.shields.io/badge/vercel%20code--style-000000?logo=vercel&logoColor=white&style=flat-square)](https://github.com/vercel/style-guide)

</div>

# Features

- ⚡️ Blazing Fast Build
- 🌳 Tree Shaking
- 🎨 Flexible & Extensible
- 💾 Caching
- 🔥 Support Hot Reload
- ~~🌍 Support Web~~ (WIP)

# Setup

```bash
# using npm
npm install -D install @react-native-esbuild/cli

# using yarn
yarn add -D @react-native-esbuild/cli
```

## Start

Launch dev server

```bash
rne start
```

| Option | Description | Default value |
|:--:|:--|:--:|
| `--entry` | entry file path | `index.js` |
| `--host` | dev server host | `127.0.0.1` |
| `--port` | dev server port | `8081` |
| `--dev` | set as development environment | `true` |
| `--minify` | enable minify | `false` |
| `--debug` | show cli debug log | `false` |

## Build

Build bundle

```bash
rne build --platform=<platform> --output=<dest>
```

| Option | Description | Default value |
|:--:|:--|:--:|
| `--platform` | (required) platform for resolve modules | |
| `--entry` | entry file path | `index.js` |
| `--output` | (required) bundle result destination | |
| `--assets` | assets directory | |
| `--dev` | set as development environment | `true` |
| `--minify` | enable minify | `false` |
| `--debug` | show cli debug log | `false` |

## Cache

Manage transform cache

```bash
# clear transform cache in temporary directory
rne cache clear
```

# Customize

## Plugins

```ts
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createAssetRegisterPlugin,
  createHermesTransformPlugin,
} from '@react-native-esbuild/plugins';

const bundler = new ReactNativeEsbuildBundler(/* bundler config */);

bundler.registerPlugins((config, bundlerConfig) => {
  return [
    createAssetRegisterPlugin({ config, bundlerConfig }),
    createHermesTransformPlugin({ config, bundlerConfig }),
    {
      name: 'your-custom-esbuild-plugin',
      setup: () {
        // ...
      },
    },
  ];
});
```

# Development

```bash
# in example directory,
# run example application (start @react-native-esbuild/dev-server)
yarn start

# build example project (example/dist/<bundle and assets>)
yarn build:android
yarn build:ios
```

```bash
# run yarn commands
yarn workspace <workspaceName> <command>

# build all packages or specified package only
lerna run build
lerna run build --scope @react-native-esbuild/xxx

# run all test or specified package only
lerna run test
lerna run test --scope @react-native-esbuild/xxx

# show project dependencies graph
nx graph
```

# License

[MIT](./LICENSE)
