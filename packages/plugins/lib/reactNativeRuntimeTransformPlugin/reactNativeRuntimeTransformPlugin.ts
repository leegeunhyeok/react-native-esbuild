import fs from 'node:fs/promises';
import path from 'node:path';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import {
  ReactNativeEsbuildBundler as Bundler,
  type EsbuildPluginFactory,
} from '@react-native-esbuild/core';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  transformWithBabel,
  transformWithSwc,
} from '@react-native-esbuild/transformer';
import { logger } from '../shared';
import type { ReactNativeRuntimeTransformPluginConfig } from '../types';

const NAME = 'react-native-runtime-transform-plugin';

const isFlow = (source: string, path: string): boolean => {
  return (
    path.endsWith('.js') &&
    ['@flow', '@noflow'].some((flowSyntaxToken) =>
      source.includes(flowSyntaxToken),
    )
  );
};

export const createReactNativeRuntimeTransformPlugin: EsbuildPluginFactory<
  ReactNativeRuntimeTransformPluginConfig
> = (config) => {
  return function reactNativeRuntimeTransformPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const localState = { initializeCoreInjected: false };
        const injectScriptPaths = [
          getReactNativeInitializeCore(context.root),
          ...(config?.injectScriptPaths ?? []),
        ];
        const cacheController = Bundler.caches.get(context.id.toString());
        const cacheEnabled = context.dev;
        const root = context.root;
        const {
          stripFlowPackageNames = [],
          fullyTransformPackageNames = [],
          customTransformRules = [],
        } = context.config.transform;
        const entryFile = path.resolve(root, context.entry);

        const stripFlowPackageNamesRegExp = stripFlowPackageNames.length
          ? new RegExp(`/node_modules/(?:${stripFlowPackageNames.join('|')})/`)
          : undefined;

        const fullyTransformPackagesRegExp = fullyTransformPackageNames.length
          ? new RegExp(
              `node_modules/(?:${fullyTransformPackageNames.join('|')})/`,
            )
          : undefined;

        const combineInjectScripts = (
          code: string,
          injectScriptPaths: string[],
        ): string => {
          return [
            injectScriptPaths.map((modulePath) => `import '${modulePath}';`),
            code,
          ].join('\n');
        };

        const getTransformedCodeFromCache = async (
          key: string,
          modifiedAt: number,
        ): Promise<string | null> => {
          if (!cacheEnabled) return null;

          const inMemoryCache = cacheController.readFromMemory(key);

          // 1. find cache from memory
          if (inMemoryCache) {
            if (inMemoryCache.modifiedAt === modifiedAt) {
              // file is not modified, using cache data
              return inMemoryCache.data;
            }

            return null;
          }

          const fsCache = await cacheController.readFromFileSystem(key);

          // 2. find cache from fils system
          if (fsCache) {
            cacheController.writeToMemory(key, {
              data: fsCache,
              modifiedAt,
            });
            return fsCache;
          }

          // 3. cache not found
          return null;
        };

        const transformSource = async (
          args: OnLoadArgs,
          cacheConfig: { modifiedAt: number; hash: string },
        ): Promise<string> => {
          let source = await fs.readFile(args.path, { encoding: 'utf-8' });
          const transformContext = { path: args.path, root };

          // if target file is entry, inject initializeCore into top
          if (!localState.initializeCoreInjected && entryFile === args.path) {
            source = combineInjectScripts(source, injectScriptPaths);
            localState.initializeCoreInjected = true;
          }

          if (fullyTransformPackagesRegExp?.test(args.path)) {
            const fullyTransformResult = await transformWithBabel(
              source,
              transformContext,
              {
                // follow babelrc of react-native project's root (same as metro)
                babelrc: true,
              },
            );

            return fullyTransformResult;
          }

          if (
            stripFlowPackageNamesRegExp?.test(args.path) ||
            isFlow(source, args.path)
          ) {
            source = await stripFlowWithSucrase(source, transformContext);
          }

          for await (const rule of customTransformRules) {
            if (rule.test(args.path, source)) {
              source = await transformWithBabel(source, transformContext, {
                babelrc: false,
                plugins: rule.plugins,
              });
            }
          }

          // transform source target to es5
          source = await transformWithSwc(source, transformContext);

          if (cacheEnabled) {
            cacheController.writeToMemory(cacheConfig.hash, {
              data: source,
              modifiedAt: cacheConfig.modifiedAt,
            });
            await cacheController.writeToFileSystem(cacheConfig.hash, source);
          }

          return source;
        };

        build.onStart(() => {
          // reset local states
          localState.initializeCoreInjected = false;
        });

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          const { mtimeMs } = await fs.stat(args.path);

          /**
           * `id` is combined value (platform, dev, minify)
           * use `id` as filesystem hash key generation
           *
           * md5(id + modified time + file path) = cache key
           *     number + number        + string
           */
          const hash = cacheController.getCacheHash(
            context.id + mtimeMs + args.path,
          );

          const cache = await getTransformedCodeFromCache(hash, mtimeMs);

          return {
            contents: cache
              ? cache
              : await transformSource(args, { hash, modifiedAt: mtimeMs }),
            loader: 'js',
          } as OnLoadResult;
        });

        build.onEnd(async () => {
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
