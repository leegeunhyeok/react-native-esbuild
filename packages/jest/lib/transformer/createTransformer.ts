import type {
  TransformOptions,
  TransformedSource,
  TransformerCreator,
  SyncTransformer,
} from '@jest/transform';
import createCacheKeyFunction from '@jest/create-cache-key-function';
import md5 from 'md5';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  SyncTransformPipeline,
  AsyncTransformPipeline,
  swcPresets,
  type TransformerContext,
} from '@react-native-esbuild/transformer';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import type { TransformerConfig } from '../types';
import pkg from '../../package.json';

const DUMMY_ESBUILD_VALUE = '';
const ROOT = process.cwd();
const TRANSFORMER_CONTEXT: TransformerContext = {
  root: ROOT,
  id: 0,
  dev: true,
  entry: '',
  path: '',
};

ReactNativeEsbuildBundler.bootstrap();

export const createTransformer: TransformerCreator<
  SyncTransformer,
  TransformerConfig
> = (config): SyncTransformer => {
  // @ts-expect-error -- ESM default export
  const cacheKeyFunction = createCacheKeyFunction.default([], [pkg.version]);
  const { transformer } = ReactNativeEsbuildBundler.getConfig();
  const instrumentEnabled = Boolean(
    config?.experimental?.customCoverageInstrumentation,
  );
  const swcExperimentalOptions = instrumentEnabled
    ? config?.experimental
    : undefined;

  const syncTransformPipeline = new SyncTransformPipeline.builder(
    TRANSFORMER_CONTEXT,
  )
    .setSwcPreset(
      swcPresets.getJestPreset({
        module: 'cjs',
        experimental: swcExperimentalOptions,
      }),
    )
    .setInjectScripts([getReactNativeInitializeCore(ROOT)])
    .setFullyTransformPackages(transformer?.fullyTransformPackageNames ?? [])
    .setStripFlowPackages(transformer?.stripFlowPackageNames ?? [])
    .setAdditionalBabelTransformRules(
      transformer?.additionalTransformRules?.babel ?? [],
    )
    .setAdditionalSwcTransformRules(
      transformer?.additionalTransformRules?.swc ?? [],
    )
    .build();

  const asyncTransformPipeline = new AsyncTransformPipeline.builder(
    TRANSFORMER_CONTEXT,
  )
    .setSwcPreset(
      // Async transform is always ESM.
      swcPresets.getJestPreset({
        module: 'esm',
        experimental: swcExperimentalOptions,
      }),
    )
    .setInjectScripts([getReactNativeInitializeCore(ROOT)])
    .setFullyTransformPackages(transformer?.fullyTransformPackageNames ?? [])
    .setStripFlowPackages(transformer?.stripFlowPackageNames ?? [])
    .setAdditionalBabelTransformRules(
      transformer?.additionalTransformRules?.babel ?? [],
    )
    .setAdditionalSwcTransformRules(
      transformer?.additionalTransformRules?.swc ?? [],
    )
    .build();

  return {
    canInstrument: instrumentEnabled,
    process: (
      code: string,
      path: string,
      _options: TransformOptions,
    ): TransformedSource => {
      const transformResult = syncTransformPipeline.transform(code, {
        path,
        pluginData: DUMMY_ESBUILD_VALUE,
        namespace: DUMMY_ESBUILD_VALUE,
        suffix: DUMMY_ESBUILD_VALUE,
        with: {},
      });
      return { code: transformResult.code };
    },
    processAsync: async (
      code: string,
      path: string,
      _options: TransformOptions,
    ): Promise<TransformedSource> => {
      const transformResult = await asyncTransformPipeline.transform(code, {
        path,
        pluginData: DUMMY_ESBUILD_VALUE,
        namespace: DUMMY_ESBUILD_VALUE,
        suffix: DUMMY_ESBUILD_VALUE,
        with: {},
      });
      return { code: transformResult.code };
    },
    getCacheKey: (
      code: string,
      path: string,
      options: TransformOptions,
    ): string => {
      return md5(cacheKeyFunction(code, path, options));
    },
  };
};
