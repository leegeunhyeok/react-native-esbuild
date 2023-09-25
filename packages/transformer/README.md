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
await transformWithBabel(code, context, customOptions);
await transformWithSwc(code, context, customOptions);
await minifyWithSwc(code, context, customOptions);
```
