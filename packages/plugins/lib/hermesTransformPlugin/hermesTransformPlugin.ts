import fs from 'node:fs/promises';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import {
  ReactNativeEsbuildBundler,
  type EsbuildPluginFactory,
} from '@react-native-esbuild/core';
import {
  transformWithBabel,
  transformWithSwc,
  stripFlowWithSucrase,
} from './transformer';

const NAME = 'hermes-transform-plugin';

const isFlow = (source: string, path: string): boolean => {
  return (
    path.endsWith('.js') &&
    ['@flow', '@noflow'].some((flowSyntaxToken) =>
      source.includes(flowSyntaxToken),
    )
  );
};

export const createHermesTransformPlugin: EsbuildPluginFactory = () => {
  return function hermesTransformPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const cacheController = ReactNativeEsbuildBundler.caches.get(
          context.taskId.toString(),
        );
        const cacheEnabled = context.dev;
        const root = context.root;
        const {
          stripFlowPackageNames = [],
          fullyTransformPackageNames = [],
          customTransformRules = [],
        } = context.config.transform;

        const stripFlowPackageNamesRegExp = stripFlowPackageNames.length
          ? new RegExp(`/node_modules/(?:${stripFlowPackageNames.join('|')})/`)
          : undefined;

        const fullyTransformPackagesRegExp = fullyTransformPackageNames.length
          ? new RegExp(
              `node_modules/(?:${fullyTransformPackageNames.join('|')})/`,
            )
          : undefined;

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
          let fullyTransformed = false;
          const context = { args, root };

          if (fullyTransformPackagesRegExp?.test(args.path)) {
            source = await transformWithBabel(source, context, {
              // follow babelrc of react-native project's root (same as metro)
              babelrc: true,
            });
            fullyTransformed = true;
          }

          if (
            !fullyTransformed &&
            (stripFlowPackageNamesRegExp?.test(args.path) ||
              isFlow(source, args.path))
          ) {
            source = await stripFlowWithSucrase(source, context);
          }

          for await (const rule of customTransformRules) {
            if (rule.test(args.path, source)) {
              source = await transformWithBabel(source, context, {
                babelrc: false,
                plugins: rule.plugins,
              });
            }
          }

          // transform source target to es5
          source = await transformWithSwc(source, context);

          if (cacheEnabled) {
            cacheController.writeToMemory(cacheConfig.hash, {
              data: source,
              modifiedAt: cacheConfig.modifiedAt,
            });
            await cacheController.writeToFileSystem(cacheConfig.hash, source);
          }

          return source;
        };

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          const { mtimeMs } = await fs.stat(args.path);

          // `taskId` is combined value (platform, dev, minify)
          // use `taskId` as filesystem hash key generation
          //
          // md5(taskId + modified time + file path) = cache key
          //     number + number        + string
          //
          const hash = cacheController.getCacheHash(
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            context.taskId + mtimeMs + args.path,
          );

          const cache = await getTransformedCodeFromCache(hash, mtimeMs);

          return {
            contents: cache
              ? cache
              : await transformSource(args, { hash, modifiedAt: mtimeMs }),
            loader: 'js',
          } as OnLoadResult;
        });
      },
    };
  };
};
