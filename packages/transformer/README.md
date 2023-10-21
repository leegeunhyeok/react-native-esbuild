# `@react-native-esbuild/transformer`

## Usage

```ts
import {
  stripFlowWithSucrase,
  transformWithBabel,
  transformWithSwc,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';

await stripFlowWithSucrase(code, context);
await transformWithBabel(code, context, options);
await transformWithSwc(code, context, options);
await minifyWithSwc(code, context, options);
```
