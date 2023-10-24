import type {
  Transformer,
  TransformOptions,
  TransformedSource,
} from '@jest/transform';
import getCacheKeyFunction from '@jest/create-cache-key-function';
import md5 from 'md5';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  SyncTransformPipeline,
  AsyncTransformPipeline,
  swcPresets,
} from '@react-native-esbuild/transformer';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import type { TransformerConfig } from '../types';
import pkg from '../../package.json';

const DUMMY_ENTRY = '';
const DUMMY_ESBUILD_VALUE = '';
const ROOT = process.cwd();

ReactNativeEsbuildBundler.bootstrap();

export const createTransformer = (config: TransformerConfig): Transformer => {
  const cacheKeyFunction = getCacheKeyFunction([], [pkg.version]);
  const { transformer } = ReactNativeEsbuildBundler.getConfig();
  const instrumentEnabled = Boolean(
    config.experimental?.customCoverageInstrumentation,
  );
  const swcExperimentalOptions = instrumentEnabled
    ? config.experimental
    : undefined;

  const syncTransformPipeline = new SyncTransformPipeline.builder(
    ROOT,
    DUMMY_ENTRY,
    {
      swc: swcPresets.getJestOptions({
        module: 'cjs',
        experimental: swcExperimentalOptions,
      }),
    },
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
    ROOT,
    DUMMY_ENTRY,
    {
      // Async transform is always ESM.
      swc: swcPresets.getJestOptions({
        module: 'esm',
        experimental: swcExperimentalOptions,
      }),
    },
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
      });
      return { code: transformResult.code };
    },
    getCacheKey: (
      code: string,
      path: string,
      options: TransformOptions,
    ): string => {
      // @ts-expect-error -- `NewGetCacheKeyFunction`
      return md5(cacheKeyFunction(code, path, options));
    },
  };
};
