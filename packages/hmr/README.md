# `@react-native-esbuild/hmr`

> `react-refresh` based HMR implementation for @react-native-esbuild

## Usage

1. Add import statement to top of entry file(`import 'hmr:runtime';`)
2. Wrap React component module with `wrapWithHmrBoundary`

```js
import {
  getHmrRuntimeInitializeScript,
  wrapWithHmrBoundary,
  HMR_RUNTIME_IMPORT_NAME
} from '@react-native-esbuild/hmr';

// In esbuild plugin
build.onResolve({ filter: new RegExp(HMR_RUNTIME_IMPORT_NAME) }, (args) => {
  return {
    path: args.path,
    namespace: 'hmr-runtime',
  };
});

build.onLoad({ filter: /(?:.*)/, namespace: 'hmr-runtime' }, (args) => {
  return {
    js: await getHmrRuntimeInitializeScript(),
    loader: 'js',
  };
});

build.onLoad({ filter: /* some filter */ }, (args) => {
  if (isEntryFile) {
    code = await fs.readFile(args.path, 'utf-8');
    code = `import ${HMR_RUNTIME_IMPORT_NAME};\n\n` + code;
    // ...

    return {
      contents: code,
      loader: 'js',
    };
  } else {
    // ...

    return {
      // code, component name, module id
      contents: wrapWithHmrBoundary(code, '', args.path),
      loader: 'js',
    };
  }
});
```
