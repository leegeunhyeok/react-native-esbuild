import type { Plugin } from 'esbuild';
import type { BabelTransformRule, SwcTransformRule } from './transformers';

export interface Config {
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
     * Disable log.
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
      babel?: BabelTransformRule[];
      /**
       * Additional swc transform rules
       */
      swc?: SwcTransformRule[];
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
     * <!-- before -->
     * <tag>{{placeholder_name}}</tag>
     *
     * <!-- after -->
     * <tag>Hello, world!</tag>
     * ```
     *
     * ---
     *
     * Reserved placeholder name
     *
     * - `root`: root tag id
     * - `script`: bundled script path
     */
    placeholders?: Record<string, string>;
  };
  /**
   * Additional Esbuild plugins.
   */
  plugins?: Plugin[];
  /**
   * Experimental configurations
   */
  experimental?: {
    /**
     * Enable HMR(Hot Module Replacement) on development mode.
     *
     * Defaults to `false`.
     */
    hmr?: boolean;
  };
}
