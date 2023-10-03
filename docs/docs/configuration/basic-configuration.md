---
title: Basic Configuration
sidebar_position: 1
slug: /configuration/basic
---

# Basic Configuration

## Configuration

`<projectRoot>/react-native-esbuild.js`

```js
/**
 * @type {import('@react-native-esbuild/core').Config}
 */
exports.default = {};
```

By default, follow the configuration below.

```js
export.default = {
  cache: true,
  mainFields: ['react-native', 'browser', 'main', 'module'],
  logger: {
    disabled: false,
    timestamp: null,
  },
  transformer: {
    stripFlowPackageNames: ['react-native'],
  },
};
```

### cache

Enable cache.

Defaults to `true`

### mainFields

Field names for resolve package's modules.

Defaults to `['react-native', 'browser', 'main', 'module']`

### plugins

Additional Esbuild plugins.

For more details, go to [Custom Plugins](/configuration/custom-plugins)

### logger

Logger configurations.

- `logger.disabled`: Disable client log (Defaults to `false`)
- `logger.timestamp`: Print timestamp with log when format is specified (Defaults to `null`)

### transformer

Transformer configurations.

- `transformer.convertSvg`: If `true`, convert svg assets to `react-native-svg` based component.
- `transformer.stripFlowPackageNames`: Package names to strip flow syntax from (Defaults to `['react-native']`)
- `transformer.fullyTransformPackageNames`: Package names to fully transform with [metro-react-native-babel-preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset) from
  :::warning
  This may slow down code transformation
  :::
- `transformer.additionalTransformRules`: Additional transform rules. This rules will be applied before phase of transform to es5
  - For more details, go to [Custom Transformation](/configuration/custom-transformation)

## Types

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
   * Additional Esbuild plugins.
   */
  plugins?: EsbuildPlugin[];
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

<details><summary>Custom Transform Rules</summary>


```ts
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
```

</details>

<details><summary>ReportableEvent</summary>

```ts
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
