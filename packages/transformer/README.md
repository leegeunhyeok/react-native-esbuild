# `@react-native-esbuild/transformer`

## Usage

```ts
import {
  stripFlowWithSucrase,
  transformWithBabel,
  transformWithSwc,
} from '@react-native-esbuild/transformer';

await stripFlowWithSucrase(code, context);
await transformWithBabel(code, context, options);
await transformWithSwc(code, context, options);
```
