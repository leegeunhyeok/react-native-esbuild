# Troubleshooting

## On build time

- When `No matching export in "xxx" for import "xxx"` occurs
  - Replace import statements to `type import` statements.
  ```ts
  // AS IS
  import { ValueIdentifier, TypeIdentifierA } from '...';
  import TypeIdentifierB from '...';

  // TO BE
  import { ValueIdentifier, type TypeIdentifierA } from '...';
  import type TypeIdentifierB from '...';
  ```
- When `Syntax Error` occurs
  - Target library may be using [Flow](https://flow.org).
  - Add the package name to `stripFlowPackageNames` in configuration file.
- When unknown error occurs
  - Add the package name to `fullyTransformPackageNames` in configuration file.
- Try rebuild with `--reset-cache` flag.
- Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.

## On runtime

There're many reasons for runtime errors, making it difficult to determine the cause.

Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.
