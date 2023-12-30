import type { TransformContext } from '@react-native-esbuild/shared';

export type AsyncTransformer<TransformerOptions> = (
  code: string,
  config: TransformerConfig<TransformerOptions>,
) => Promise<string>;

export type SyncTransformer<TransformerOptions> = (
  code: string,
  config: TransformerConfig<TransformerOptions>,
) => string;

interface TransformerConfig<TransformerOptions> {
  context: TransformContext;
  preset?: TransformerOptionsPreset<TransformerOptions>;
}

export type TransformerOptionsPreset<TransformerOptions> = (
  context: TransformContext,
) => TransformerOptions;

export interface SwcJestPresetOptions {
  module?: 'cjs' | 'esm';
  experimental?: {
    /**
     * Option for Jest compatibility.
     *
     * Using swc to transform code to comply with the ESM specification,
     * but Jest to test it in a CJS environment, may encounter issues
     * due to the immutable issue of exports.
     *
     * To avoid the issue, enable option.
     * It will be transformed exports with add `configurable: true`.
     *
     * Defaults to `true`
     *
     * @see {@link https://github.com/swc-project/swc/discussions/5151}
     */
    mutableCjsExports?: boolean;
    /**
     * @see {@link https://github.com/kwonoj/swc-plugin-coverage-instrument}
     */
    customCoverageInstrumentation?: {
      coverageVariable?: string;
      compact?: boolean;
      reportLogic?: boolean;
      ignoreClassMethods?: string[];
      instrumentLog?: { level: string; enableTrace: boolean };
    };
  };
}

export interface SwcMinifyPresetOptions {
  minify: boolean;
}

// TransformPipelineBuilder
export type TransformStep<Result> = (
  code: string,
  context: TransformContext,
) => Result;

export type AsyncTransformStep = TransformStep<Promise<TransformResult>>;
export type SyncTransformStep = TransformStep<TransformResult>;

export interface TransformResult {
  code: string;
  done: boolean;
}
