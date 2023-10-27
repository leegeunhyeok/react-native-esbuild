import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ReactNativeEsbuildBundler as Bundler,
  type ReactNativeEsbuildPluginCreator,
} from '@react-native-esbuild/core';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import {
  AsyncTransformPipeline,
  swcPresets,
  type AsyncTransformStep,
} from '@react-native-esbuild/transformer';
import { wrapModuleBoundary } from '@react-native-esbuild/hmr';
import { logger } from '../shared';
import type { ReactNativeRuntimeTransformPluginConfig } from '../types';
import {
  getTransformedCodeFromInMemoryCache,
  getTransformedCodeFromFileSystemCache,
  writeTransformedCodeToInMemoryCache,
  writeTransformedCodeToFileSystemCache,
} from './helpers';

const NAME = 'react-native-runtime-transform-plugin';

export const createReactNativeRuntimeTransformPlugin: ReactNativeEsbuildPluginCreator<
  ReactNativeRuntimeTransformPluginConfig
> = (context, config) => ({
  name: NAME,
  setup: (build): void => {
    const cacheController = Bundler.caches.get(context.id);
    const bundlerSharedData = Bundler.shared.get(context.id);
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
      context.dev ? '@react-native-esbuild/hmr/runtime' : null,
      ...(config?.injectScriptPaths ?? []),
    ].filter(Boolean) as string[];

    const onBeforeTransform: AsyncTransformStep = async (
      code,
      args,
      moduleMeta,
    ) => {
      const isChangedFile = bundlerSharedData.watcher.changed === args.path;
      const cacheConfig = {
        hash: moduleMeta.hash,
        mtimeMs: moduleMeta.stats.mtimeMs,
      };

      // 1. Force re-transform when file is changed.
      if (isChangedFile) {
        logger.debug('changed file detected', { path: args.path });
        bundlerSharedData.hmr = { id: moduleMeta.hash, path: args.path };
        return { code, done: false };
      }

      /**
       * 2. Use previous transformed result and skip transform
       *    when file is not changed and transform result exist in memory.
       */
      const inMemoryCache = getTransformedCodeFromInMemoryCache(
        cacheController,
        cacheConfig,
      );
      if (inMemoryCache) {
        return { code: inMemoryCache, done: true };
      }

      // 3. Transform code on each build task when cache is disabled.
      if (!cacheEnabled) {
        return { code, done: false };
      }

      // 4. Trying to get cache from file system.
      //    = cache exist ? use cache : transform code
      const cachedCode = await getTransformedCodeFromFileSystemCache(
        cacheController,
        cacheConfig,
      );

      return { code: cachedCode ?? code, done: Boolean(cachedCode) };
    };

    const onAfterTransform: AsyncTransformStep = async (
      code,
      args,
      moduleMeta,
    ) => {
      const shouldWrapModule = context.mode !== 'bundle';
      const cacheConfig = {
        hash: moduleMeta.hash,
        mtimeMs: moduleMeta.stats.mtimeMs,
      };
      writeTransformedCodeToInMemoryCache(cacheController, code, cacheConfig);

      if (cacheEnabled) {
        await writeTransformedCodeToFileSystemCache(
          cacheController,
          code,
          cacheConfig,
        );
      }

      return {
        code: shouldWrapModule
          ? wrapModuleBoundary(
              code,
              moduleMeta.hash,
              bundlerSharedData.watcher.changed === args.path,
            )
          : code,
        done: true,
      };
    };

    let transformPipeline: AsyncTransformPipeline;
    const transformPipelineBuilder = new AsyncTransformPipeline.builder(context)
      .setSwcPreset(swcPresets.getReactNativeRuntimePreset())
      .setInjectScripts(injectScriptPaths)
      .setFullyTransformPackages(fullyTransformPackageNames)
      .setStripFlowPackages(stripFlowPackageNames)
      .setAdditionalBabelTransformRules(additionalBabelRules)
      .setAdditionalSwcTransformRules(additionalSwcRules)
      .onStart(onBeforeTransform)
      .onEnd(onAfterTransform);

    build.onStart(() => {
      transformPipeline = transformPipelineBuilder.build();
    });

    build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
      const rawCode = await fs.readFile(args.path, { encoding: 'utf-8' });
      return {
        contents: (await transformPipeline.transform(rawCode, args)).code,
        loader: 'js',
      };
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
});
