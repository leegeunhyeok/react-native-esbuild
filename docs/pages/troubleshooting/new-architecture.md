# New Architecture

:::warning
[New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) is experimental.
:::

## react-native-reanimated

> ReferenceError: Property 'nativeFabricUIManager' doesn't exist

- Some [issue](https://github.com/leegeunhyeok/react-native-esbuild/issues/16#issuecomment-1730042378) on `react-native-reanimated` + `Fabric`
- To resolve(temporary solution), open `node_modules/react-native-reanimated/src/reanimated2/fabricUtils.ts` and change `react-native/Libraries/Renderer/shims/ReactFabric` to inline lazy require.

```diff
let findHostInstance_DEPRECATED: (ref: React.Component) => HostInstance;
- if (global._IS_FABRIC) {
-   try {
-     findHostInstance_DEPRECATED =
-     // eslint-disable-next-line @typescript-eslint/no-var-requires
-     require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
-   } catch (e) {
-     throw new Error(
-       '[Reanimated] Cannot import `findHostInstance_DEPRECATED`.'
-     );
-   }
- }

export function getShadowNodeWrapperFromRef(
  ref: React.Component
): ShadowNodeWrapper {
+ if (global._IS_FABRIC && !findHostInstance_DEPRECATED) {
+   try {
+     findHostInstance_DEPRECATED =
+     // eslint-disable-next-line @typescript-eslint/no-var-requires
+     require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
+   } catch (e) {
+     throw new Error(
+       '[Reanimated] Cannot import `findHostInstance_DEPRECATED`.'
+     );
+   }
+ }
  return findHostInstance_DEPRECATED(ref)._internalInstanceHandle.stateNode
    .node;
}
```
