import fs from 'node:fs/promises';
import path from 'node:path';
import type { OnLoadResult } from 'esbuild';
import invariant from 'invariant';
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
  makeCacheConfig,
  getTransformedCodeFromInMemoryCache,
  getTransformedCodeFromFileSystemCache,
  writeTransformedCodeToInMemoryCache,
  writeTransformedCodeToFileSystemCache,
} from './helpers';

const NAME = 'react-native-runtime-transform-plugin';

export const createReactNativeRuntimeTransformPlugin: EsbuildPluginFactory<
  ReactNativeRuntimeTransformPluginConfig
> = (config) => {
  return function reactNativeRuntimeTransformPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const cacheController = Bundler.caches.get(context.id);
        const shared = Bundler.shared.get(context.id);
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
        invariant(shared, 'no shared data');

        const onBeforeTransform: FlowRunner = async (
          code,
          args,
          sharedData,
        ) => {
          const isChangedFile = shared.watcher.changed === args.path;
          const cacheConfig = await makeCacheConfig(
            cacheController,
            args,
            context,
            isChangedFile ? shared.watcher.stats : undefined,
          );

          sharedData.hash = cacheConfig.hash;
          sharedData.mtimeMs = cacheConfig.mtimeMs;

          // 1. force re-transform when file changed
          if (isChangedFile) {
            logger.debug('changed file detected', { path: args.path });
            return { code, done: false };
          }

          // 2. using previous transformed result and skip transform
          //    when file is not changed and transform result in memory
          const inMemoryCache = getTransformedCodeFromInMemoryCache(
            cacheController,
            cacheConfig,
          );
          if (inMemoryCache) {
            return { code: inMemoryCache, done: true };
          }

          // 3. when cache is disabled, always transform code each build tasks
          if (!cacheEnabled) {
            return { code, done: false };
          }

          // 4. trying to get cache from file system
          //    = cache exist ? use cache : transform code
          const cachedCode = await getTransformedCodeFromFileSystemCache(
            cacheController,
            cacheConfig,
          );

          return { code: cachedCode ?? code, done: Boolean(cachedCode) };
        };

        const onAfterTransform: FlowRunner = async (code, _args, shared) => {
          if (!(shared.hash && shared.mtimeMs)) {
            logger.warn('unexpected cache config');
            return { code, done: true };
          }

          const cacheConfig = { hash: shared.hash, mtimeMs: shared.mtimeMs };

          writeTransformedCodeToInMemoryCache(
            cacheController,
            code,
            cacheConfig,
          );

          if (cacheEnabled) {
            await writeTransformedCodeToFileSystemCache(
              cacheController,
              code,
              cacheConfig,
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
