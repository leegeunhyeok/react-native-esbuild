import fs from 'node:fs/promises';
import path from 'node:path';
import type { OnLoadResult } from 'esbuild';
import {
  ReactNativeEsbuildBundler as Bundler,
  type EsbuildPluginFactory,
} from '@react-native-esbuild/core';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import { logger } from '../shared';
import type { ReactNativeRuntimeTransformPluginConfig } from '../types';
import {
  TransformFlowBuilder,
  type TransformFlow,
  type FlowRunner,
} from './TransformFlowBuilder';
import {
  getTransformedCodeFromCache,
  writeTransformedCodeToCache,
} from './helpers';

const NAME = 'react-native-runtime-transform-plugin';

export const createReactNativeRuntimeTransformPlugin: EsbuildPluginFactory<
  ReactNativeRuntimeTransformPluginConfig
> = (config) => {
  return function reactNativeRuntimeTransformPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const cacheController = Bundler.caches.get(context.id.toString());
        const cacheEnabled = context.config.cache ?? true;
        const {
          stripFlowPackageNames = [],
          fullyTransformPackageNames = [],
          additionalTransformRules,
        } = context.config.transformer ?? {};
        const additionalBabelRules = additionalTransformRules?.babel ?? [];
        const additionalSwcRules = additionalTransformRules?.swc ?? [];
        const injectScriptPaths = [
          getReactNativeInitializeCore(context.root),
          ...(config?.injectScriptPaths ?? []),
        ];

        const onBeforeTransform: FlowRunner = async (
          code,
          args,
          sharedData,
        ) => {
          if (!cacheEnabled) return { code, done: false };

          const {
            code: cachedCode,
            hash,
            mtimeMs,
          } = await getTransformedCodeFromCache(cacheController, args, context);

          sharedData.hash = hash;
          sharedData.mtimeMs = mtimeMs;

          return { code: cachedCode ?? code, done: Boolean(cachedCode) };
        };

        const onAfterTransform: FlowRunner = async (code, _args, shared) => {
          if (cacheEnabled && shared.hash && shared.mtimeMs) {
            await writeTransformedCodeToCache(
              cacheController,
              code,
              shared.hash,
              shared.mtimeMs,
            );
          }
          return { code, done: true };
        };

        let transformFlow: TransformFlow;
        const transformFlowBuilder = new TransformFlowBuilder(context)
          .setInjectScripts(injectScriptPaths)
          .setFullyTransformPackages(fullyTransformPackageNames)
          .setStripFlowPackages(stripFlowPackageNames)
          .setAdditionalBabelTransformRules(additionalBabelRules)
          .setAdditionalSwcTransformRules(additionalSwcRules)
          .onStart(onBeforeTransform)
          .onEnd(onAfterTransform);

        build.onStart(() => {
          transformFlow = transformFlowBuilder.build();
        });

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          return {
            contents: await transformFlow.transform(args),
            loader: 'js',
          } as OnLoadResult;
        });

        build.onEnd(async (args) => {
          if (args.errors.length) return;

          if (!(build.initialOptions.outfile && context.sourcemap)) {
            logger.debug('outfile or sourcemap path is not specified');
            return;
          }

          const sourceDirectory = path.dirname(build.initialOptions.outfile);
          const sourceName = path.basename(build.initialOptions.outfile);
          const sourceMapPath = path.join(sourceDirectory, `${sourceName}.map`);

          logger.debug('move sourcemap to specified path', {
            from: sourceMapPath,
            to: context.sourcemap,
          });

          await fs.rename(sourceMapPath, context.sourcemap);
        });
      },
    };
  };
};
