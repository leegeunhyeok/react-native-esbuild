import fs, { type FileHandle } from 'node:fs/promises';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import type { EsbuildPluginFactory } from '@react-native-esbuild/core';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { isFlow } from '../helpers';
import {
  transformWithBabel,
  stripFlowWithSucrase,
  transformWithSwc,
} from './transformer';

const NAME = 'hermes-transform-plugin';

export const createHermesTransformPlugin: EsbuildPluginFactory = () => {
  return function hermesTransformPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const cacheController = ReactNativeEsbuildBundler.caches.get(
          context.taskId.toString(),
        );
        const cacheEnabled = context.dev;
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

        const getTransformedSourceFromCache = async (
          args: OnLoadArgs,
        ): Promise<{
          contents: string;
          fromCache: boolean;
          hash?: string;
          mtimeMs?: number;
        }> => {
          let fileHandle: FileHandle | null = null;

          try {
            fileHandle = await fs.open(args.path, 'r');
            const { mtimeMs } = await fileHandle.stat();

            // `taskId` is combined value (platform, dev, minify)
            // use `taskId` as filesystem hash key generation
            //
            // md5(taskId + modified time + file path) = cache key
            //     number + number        + string
            //
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            const hashParam = context.taskId + mtimeMs + args.path;
            const hash = cacheController.getCacheHash(hashParam);

            if (cacheEnabled) {
              const inMemoryCache = cacheController.readFromMemory(hash);

              // 1. find cache from memory
              if (inMemoryCache) {
                if (inMemoryCache.modifiedAt === mtimeMs) {
                  // file is not modified, using cache data
                  return { contents: inMemoryCache.data, fromCache: true };
                }

                // cache is not exist or file is modified(stale),
                // read original content (to be transformed)
                return {
                  contents: await fileHandle.readFile({ encoding: 'utf-8' }),
                  fromCache: false,
                  hash,
                };
              }

              const cachedSource = await cacheController.readFromFileSystem(
                hash,
              );

              // 2. find cache from fils system
              if (cachedSource) {
                cacheController.writeToMemory(hash, {
                  data: cachedSource,
                  modifiedAt: mtimeMs,
                });
                return { contents: cachedSource, fromCache: true };
              }
            }

            // 3. if cache is not exist or cache is disabled, read original source code
            return {
              contents: await fileHandle.readFile({ encoding: 'utf-8' }),
              fromCache: false,
              hash,
              mtimeMs,
            };
          } finally {
            await fileHandle?.close();
          }
        };

        const transformSource = async (
          args: OnLoadArgs,
          rawSource: string,
          hash?: string,
          mtimeMs?: number,
        ): Promise<string> => {
          if (typeof hash !== 'string') {
            throw new Error('hash is required for caching');
          }

          let source = rawSource;
          let fullyTransformed = false;

          if (fullyTransformPackagesRegExp?.test(args.path)) {
            source = await transformWithBabel(source, args, {
              // follow babelrc of react-native project's root (same as metro)
              babelrc: true,
            });
            fullyTransformed = true;
          }

          if (
            !fullyTransformed &&
            (isFlow(source, args.path) ||
              stripFlowPackageNamesRegExp?.test(args.path))
          ) {
            source = stripFlowWithSucrase(source, args);
          }

          for await (const rule of customTransformRules) {
            if (rule.test(args.path, source)) {
              source = await transformWithBabel(source, args, {
                babelrc: false,
                plugins: rule.plugins,
              });
            }
          }

          // transform source target to es5
          source = await transformWithSwc(source, args);

          if (cacheEnabled) {
            cacheController.writeToMemory(hash, {
              data: source,
              modifiedAt: mtimeMs ?? 0,
            });
            await cacheController.writeToFileSystem(hash, source);
          }

          return source;
        };

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          const { contents, fromCache, hash, mtimeMs } =
            await getTransformedSourceFromCache(args);

          return {
            contents: fromCache
              ? contents
              : await transformSource(args, contents, hash, mtimeMs),
            loader: 'js',
          } as OnLoadResult;
        });
      },
    };
  };
};
