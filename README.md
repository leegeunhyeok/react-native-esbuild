<div align="center">

  # react-native-esbuild

  <img alt="logo" src="./logo.png" width="240">

  ⚡️ An extremely fast bundler + React Native

  [![esbuild](https://img.shields.io/badge/esbuild-ffcf00?logo=esbuild&logoColor=black&style=flat-square)](https://esbuild.github.io)
  [![swc](https://img.shields.io/badge/swc-e47700?logo=swc&logoColor=white&style=flat-square)](https://swc.rs)
  [![react native](https://img.shields.io/badge/react--native-61dafb?logo=react&logoColor=white&style=flat-square)](https://reactnative.dev)

  [![npm](https://img.shields.io/npm/v/@react-native-esbuild/core?color=000000&style=flat-square)](https://www.npmjs.com/settings/react-native-esbuild/packages)
  [![code style](https://img.shields.io/badge/vercel%20code--style-000000?logo=vercel&logoColor=white&style=flat-square)](https://github.com/vercel/style-guide)
  [![typescript](https://img.shields.io/badge/typescript-3178c6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)

</div>

# Features

![banner](./main.png)

> [!WARNING]
> This project is under development

- ⚡️ Blazing Fast Build
- 🌳 Supports Tree Shaking
- 💾 In-memory & Local File System Caching
- 🎨 Flexible & Extensible
- 🔥 Supports JSC & Hermes Runtime
- 🔄 Supports Live Reload
- 🐛 Supports Debugging(Flipper, Chrome Debugger)
- 🌍 Supports All Platforms(Android, iOS, Web)
- ✨ New Architecture Ready

👉 See a demo application built with a web target [here](https://rne-web-demo.vercel.app).

# Getting Started

Go to [documentation](https://react-native-esbuild.vercel.app)

# Development

```bash
# install dependencies and run build
yarn && lerna run build

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
yarn test
yarn test --selectProjects <workspaceName>

# show project dependencies graph
nx graph
```

# Benchmark

```bash
# in `example` directory

# react-native-esbuild (with cache)
time yarn bundle:android
time yarn bundle:ios
# react-native-esbuild (without cache)
time yarn bundle:android --reset-cache
time yarn bundle:ios --reset-cache

# metro (with cache)
time yarn bundle:metro:android
time yarn bundle:metro:ios
# metro (without cache)
time yarn bundle:metro:android --reset-cache
time yarn bundle:metro:ios --reset-cache
```

# License

[MIT](./LICENSE)
