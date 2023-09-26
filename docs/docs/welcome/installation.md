---
title: Installation
sidebar_position: 2
slug: /installation
---

# Installation

```bash
# using npm
npm install -D install @react-native-esbuild/cli

# using yarn
yarn add -D @react-native-esbuild/cli
```

## Configuration

Create `react-native-esbuild.js` to project root.

```js
/**
 * @type {import('@react-native-esbuild/core').ReactNativeEsbuildConfig}
 */
exports.default = {};
```

<details><summary>Detailed Configuration</summary>

```ts
interface ReactNativeEsbuildConfig {
  /**
   * Enable cache.
   *
   * Defaults to `true`
   */
  cache?: boolean;
  /**
   * Field names for resolve package's modules.
   *
   * Defaults to `['react-native', 'browser', 'main', 'module']`
   */
  mainFields?: string[];
  /**
   * Logger configurations
   */
  logger?: {
    /**
     * Disable client log.
     *
     * Defaults to `false`
     */
    disabled?: boolean;
    /**
     * Print timestamp with log when format is specified.
     *
     * Defaults to `null`
     */
    timestamp?: string | null;
  };
  /**
   * Transformer configurations
   */
  transformer?: {
    /**
     * If `true`, convert svg assets to `react-native-svg` based component
     */
    convertSvg?: boolean;
    /**
     * Strip flow syntax.
     *
     * Defaults to `['react-native']`
     */
    stripFlowPackageNames?: string[];
    /**
     * Transform with babel using `metro-react-native-babel-preset` (slow)
     */
    fullyTransformPackageNames?: string[];
    /**
     * Additional transform rules. This rules will be applied before phase of transform to es5.
     */
    additionalTransformRules?: {
      /**
       * Custom Babel rules
       */
      babel?: CustomTransformRuleBase<BabelTransformOptions>[];
      /**
       * Custom Swc rules
       */
      swc?: CustomTransformRuleBase<SwcTransformOptions>[];
    };
  };
  /**
   * Client event receiver
   */
  reporter?: (event: ReportableEvent) => void;
}
```

</details>

## Native Setup

If you want to integrate with build processes, go to Native Setup([Android](/native-setup/android), [iOS](/native-setup/ios)) guide.
