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
exports.default = {
  cache: true,
  logger: {
    disabled: false,
    timestamp: null,
  },
  resolver: {
    mainFields: ['react-native', 'browser', 'main', 'module'],
    sourceExtensions: [/* internal/lib/defaults.ts */],
    assetExtensions: [/* internal/lib/defaults.ts */],
  },
  transformer: {
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
    stripFlowPackageNames: ['react-native'],
  },
  web: {
    template: '<path to default template>',
  },
};
```

### cache

Enable cache.

Defaults to `true`

### logger

Logger configurations.

- `logger.disabled`: Disable client log (Defaults to `false`)
- `logger.timestamp`: Print timestamp with log when format is specified (Defaults to `null`)

### resolver

Resolver configurations.

- `resolver.mainFields`: When importing from an npm package, this option will determine which fields in its `package.json` are checked. (Defaults to `['react-native', 'browser', 'main', 'module']`)
- `resolver.sourceExtensions`: File extensions for transform. ([Default](https://github.com/leegeunhyeok/react-native-esbuild/blob/master/packages/internal/lib/defaults.ts))
- `resolver.assetExtensions`: File extensions for assets registration. ([Default](https://github.com/leegeunhyeok/react-native-esbuild/blob/master/packages/internal/lib/defaults.ts))

### transformer

Transformer configurations.

- `transformer.jsc`: [jsc](https://swc.rs/docs/configuration/compilation) config in swc.
- `transformer.stripFlowPackageNames`: Package names to strip flow syntax from (Defaults to `['react-native']`)
- `transformer.fullyTransformPackageNames`: Package names to fully transform with [metro-react-native-babel-preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset) from
  :::warning
  This may slow down code transformation
  :::
- `transformer.additionalTransformRules`: Additional transform rules. This rules will be applied before phase of transform to es5
  - For more details, go to [Custom Transformation](/configuration/custom-transformation)

### web

Web configurations.

For more details, go to [Web Support](/web).

### plugins

Additional Esbuild plugins.

For more details, go to [Custom Plugins](/configuration/custom-plugins)

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
   * Resolver configurations
   */
  resolver?: {
    /**
     * Field names for resolve package's modules.
     *
     * Defaults to `['react-native', 'browser', 'main', 'module']`
     */
    mainFields?: string[];
    /**
     * File extensions for transform.
     *
     * Defaults: https://github.com/leegeunhyeok/react-native-esbuild/blob/master/packages/internal/lib/defaults.ts
     */
    sourceExtensions?: string[];
    /**
     * File extensions for assets registration.
     *
     * Defaults: https://github.com/leegeunhyeok/react-native-esbuild/blob/master/packages/internal/lib/defaults.ts
     */
    assetExtensions?: string[];
  };
  /**
   * Transformer configurations
   */
  transformer?: {
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
       * Additional babel transform rules
       */
      babel?: TransformRuleBase<BabelTransformOptions>[];
      /**
       * Additional swc transform rules
       */
      swc?: TransformRuleBase<SwcTransformOptions>[];
    };
  };
  /**
   * Web configurations
   */
  web?: {
    /**
     * Index page template file path
     */
    template?: string;
    /**
     * Placeholders for replacement
     *
     * ```js
     * // web.placeholders
     * { placeholder_name: 'Hello, world!' };
     * ```
     *
     * will be replaced to
     *
     * ```html
     * <!-- in template -->
     * <tag>{{placeholder_name}}</tag>
     *
     * <!-- result -->
     * <tag>Hello, world!</tag>
     * ```
     *
     * ---
     *
     * Reserved placeholder names. It will be overridden your placeholders
     *
     * - `_bundle`: bundled script path
     */
    placeholders?: Record<string, string>;
  };
  /**
   * Additional Esbuild plugins.
   */
  plugins?: EsbuildPlugin[];
  /**
   * Client event receiver
   */
  reporter?: (event: ReportableEvent) => void;
}
```

</details>

<details><summary>Custom Transform Rules</summary>


```ts
interface TransformRuleBase<T> {
  /**
   * Predicator for transform
   */
  test: (path: string, code: string) => boolean;
  /**
   * Transformer options
   */
  options: T | ((path: string, code: string) => T);
}

type SwcTransformRule = TransformRuleBase<import('@swc/core').TransformOptions>;
type BabelTransformRule = TransformRuleBase<import('@babel/core').Options>;
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
