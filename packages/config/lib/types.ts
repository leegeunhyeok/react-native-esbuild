import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { Options as SwcTransformOptions } from '@swc/core';

export type BundlerSupportPlatform = 'android' | 'ios' | 'web';

// common
export interface ReactNativeEsbuildConfig {
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
   *
   * @see Documentation {@link https://esbuild.github.io/api/#main-fields}
   */
  mainFields?: string[];
  /**
   * transform configurations
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
      babel?: CustomBabelTransformRule[];
      /**
       * Custom Swc rules
       */
      swc?: CustomSwcTransformRule[];
    };
  };
}

export interface BundleConfig {
  platform: BundlerSupportPlatform;
  entry: string;
  outfile: string;
  dev: boolean;
  minify: boolean;
  metafile: boolean;
  sourcemap?: string;
  assetsDir?: string;
}

export interface SwcPresetOptions {
  filename: string;
  root: string;
}

export enum OptionFlag {
  None = 0b00000000,
  PlatformAndroid = 0b00000001,
  PlatformIos = 0b00000010,
  PlatformWeb = 0b00000100,
  Dev = 0b00001000,
  Minify = 0b00010000,
}

// transformers
export interface CustomTransformRuleBase<T> {
  /**
   * Predicator for transform
   */
  test: (path: string, code: string) => boolean;
  /**
   * Transformer options
   */
  options: T | ((path: string, code: string) => T);
}

export type CustomBabelTransformRule =
  CustomTransformRuleBase<BabelTransformOptions>;

export type CustomSwcTransformRule =
  CustomTransformRuleBase<SwcTransformOptions>;
