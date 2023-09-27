---
title: Installation
sidebar_position: 2
slug: /installation
---

# Installation

```bash
# using npm
npm install -D @react-native-esbuild/cli

# using yarn
yarn add -D @react-native-esbuild/cli
```

## Configuration

Create `react-native-esbuild.js` to project root.

```js
/**
 * @type {import('@react-native-esbuild/core').Config}
 */
exports.default = {};
```

<details><summary>Config</summary>

```ts
interface Config {
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


interface CustomTransformRuleBase<T> {
  /**
   * Predicator for transform
   */
  test: (path: string, code: string) => boolean;
  /**
   * Transformer options
   */
  options: T | ((path: string, code: string) => T);
}

type BabelTransformRule = CustomTransformRuleBase<BabelTransformOptions>;
type SwcTransformRule = CustomTransformRuleBase<SwcTransformOptions>;

type ReportableEvent = ClientLogEvent;

interface ClientLogEvent {
  type: 'client_log';
  level:
    | 'trace'
    | 'info'
    | 'warn'
    | 'error'
    | 'log'
    | 'group'
    | 'groupCollapsed'
    | 'groupEnd'
    | 'debug';
  data: unknown[];
  mode: 'BRIDGE' | 'NOBRIDGE';
}
```

</details>

## Native Setup

If you want to integrate with build processes, go to Native Setup([Android](/native-setup/android), [iOS](/native-setup/ios)) guide.
