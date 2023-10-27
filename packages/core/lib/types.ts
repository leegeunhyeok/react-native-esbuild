import type { Stats } from 'node:fs';
import type { BuildContext, Plugin } from 'esbuild';
import type {
  BabelTransformRule,
  SwcTransformRule,
} from '@react-native-esbuild/transformer';
import type { BundleOptions } from '@react-native-esbuild/config';

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
   * Client event receiver (only work on native)
   */
  reporter?: (event: ReportableEvent) => void;
}

export interface BundlerInitializeOptions {
  watcherEnabled?: boolean;
}

export type BundleMode = 'bundle' | 'watch';

export interface BuildTask {
  context: BuildContext;
  handler: PromiseHandler<BundleResult> | null;
  status: 'pending' | 'resolved';
  buildCount: number;
}

export type BundleResult = BundleSuccessResult | BundleFailureResult;

export interface BundleSuccessResult {
  result: {
    source: Uint8Array;
    sourcemap: Uint8Array;
    bundledAt: Date;
    revisionId: string;
  };
  error: null;
}

export interface BundleFailureResult {
  result: null;
  error: Error;
}

export type ReactNativeEsbuildPluginCreator<PluginConfig = void> = (
  context: PluginContext,
  config?: PluginConfig,
) => Plugin;

export interface BundlerSharedData {
  watcher: {
    changed: string | null;
    stats: Stats | null;
  };
  hmr: {
    id: string | null;
    path: string | null;
  };
}

export type BundlerAdditionalData = Record<string, unknown>;
export interface UpdatedModule {
  id: string;
  path: string;
  code: string;
  mode: 'hot-reload' | 'full-reload';
}

export interface PluginContext extends BundleOptions {
  id: number;
  root: string;
  config: Config;
  mode: BundleMode;
  additionalData?: BundlerAdditionalData;
}

export interface BundleRequestOptions {
  entry?: BundleOptions['entry'];
  dev?: BundleOptions['dev'];
  minify?: BundleOptions['minify'];
  platform: BundleOptions['platform'];
  runModule: boolean;
}

export interface PromiseHandler<Result> {
  task: Promise<Result>;
  resolver?: (val: Result) => void;
  rejecter?: (reason?: unknown) => void;
}

export interface Cache {
  data: string;
  modifiedAt: number;
}

export type ReportableEvent = ClientLogEvent;

/**
 * Event reportable event types
 *
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/lib/reporting.js#L36}
 */
export interface ClientLogEvent {
  type: 'client_log';
  level:
    | 'trace'
    | 'info'
    | 'warn'
    /**
     * In react-native, ReportableEvent['level'] does not defined `error` type.
     * But, flipper supports the `error` type.
     *
     * @see {@link https://github.com/facebook/flipper/blob/v0.211.0/desktop/flipper-common/src/server-types.tsx#L76}
     */
    | 'error'
    | 'log'
    | 'group'
    | 'groupCollapsed'
    | 'groupEnd'
    | 'debug';
  data: unknown[];
  mode: 'BRIDGE' | 'NOBRIDGE';
}

// StatusLogger
export interface BuildStatus {
  total: number;
  resolved: number;
  loaded: number;
}
