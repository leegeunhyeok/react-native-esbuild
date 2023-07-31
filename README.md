<div align="center">

  # react-native-esbuild

  > ⚡️ An extremely fast bundler + React Native

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
- ~~💾 Caching~~ (WIP)
- ~~🔥 Support Hot Reload~~ (WIP)
- ~~🌍 Support Web~~ (WIP)

# Development

```bash
# run example application (start @react-native-esbuild/dev-server)
lerna run start --scope="example"

# build example project (example/dist/<bundle and assets>)
lerna run build:android --scope="example"
lerna run build:ios --scope="example"
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
