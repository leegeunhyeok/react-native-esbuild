import type { FileHandle } from 'node:fs/promises';
import fs from 'node:fs/promises';
import {
  loadOptions as loadBabelOptions,
  transform as babelTransform,
  type TransformOptions as BabelTransformOptions,
  type BabelFileResult,
} from '@babel/core';
import { transform as swcTransform } from '@swc/core';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import { CacheManager } from '@react-native-esbuild/core';
import { getBabelOptions, getSwcOptions } from '@react-native-esbuild/config';
import { promisify, isFlow } from '../helpers';
import type { PluginCreator } from '../types';
import { logger } from '../shared';

const NAME = 'hermes-transform-plugin';

const transformWithBabel = async (
  source: string,
  args: OnLoadArgs,
  customOptions?: BabelTransformOptions,
): Promise<string> => {
  const options = loadBabelOptions({
    ...getBabelOptions(customOptions),
    filename: args.path,
    caller: {
      name: '@react-native-esbuild/plugins',
    },
  });

  if (!options) {
    throw new Error('cannot load babel options');
  }

  const { code } = await promisify<BabelFileResult>((handler) =>
    babelTransform(source, options, handler),
  );

  if (typeof code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return code;
};

const transformWithSwc = async (
  source: string,
  args: OnLoadArgs,
): Promise<string> => {
  const options = getSwcOptions({ filename: args.path });
  const { code } = await swcTransform(source, options);

  if (typeof code !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return code;
};

export const createHermesTransformPlugin: PluginCreator<null> = (
  _config,
  context,
) => ({
  name: NAME,
  setup: (build): void => {
    const cache = new CacheManager();
    const {
      transform: { fullyTransformPackageNames = [] },
      // TODO: need to implement caching features
      cache: cacheEnabled,
    } = context.config;
    const workingDirectory = process.cwd();

    const fullyTransformPackagesRegExp = fullyTransformPackageNames.length
      ? new RegExp(`node_modules/${fullyTransformPackageNames.join('|')}/`)
      : undefined;

    const getTransformedSourceFromCache = async (
      args: OnLoadArgs,
    ): Promise<{ contents: string; fromCache: boolean; hash?: string }> => {
      let fileHandle: FileHandle | null = null;
      let hash: string | undefined;

      try {
        fileHandle = await fs.open(args.path, 'r');

        if (cacheEnabled) {
          const { mtimeMs } = await fileHandle.stat();
          const memoryCacheKey = `${args.path}${
            build.initialOptions.platform ?? ''
          }`;
          const inMemoryCache = cache.readFromMemory(memoryCacheKey);
          const hashParam = [
            build.initialOptions.platform,
            args.path,
            mtimeMs,
          ] as const;

          // 1. find cache from memory
          if (inMemoryCache) {
            if (inMemoryCache.modifiedAt === mtimeMs) {
              // file is not modified, using cache data
              logger.debug(`in-memory cache hit: ${args.path}`);
              return { contents: inMemoryCache.data, fromCache: true };
            }

            // cache is not exist or file is modified(stale),
            // read original content (to be transformed)
            return {
              contents: await fileHandle.readFile({ encoding: 'utf-8' }),
              fromCache: false,
              hash: cache.getCacheHash(hashParam),
            };
          }

          hash = cache.getCacheHash(hashParam);
          const cachedSource = await cache.readFromFileSystem(hash);

          // 2. find cache from fils system
          if (cachedSource) {
            cache.writeToMemory(memoryCacheKey, {
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
        };
      } finally {
        await fileHandle?.close();
      }
    };

    const transformSource = async (
      args: OnLoadArgs,
      rawSource: string,
      hash?: string,
    ): Promise<string> => {
      if (typeof hash !== 'string') {
        throw new Error('hash is required for caching');
      }

      let source = rawSource;

      if (isFlow(source, args.path)) {
        source = await transformWithBabel(source, args, {
          babelrc: false,
          plugins: [
            // babel plugins in metro preset
            // https://github.com/facebook/react-native/blob/main/packages/react-native-babel-preset/src/configs/main.js
            '@babel/plugin-syntax-flow',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-jsx',
          ],
        });
      }

      if (
        source.includes('react-native-reanimated') ||
        fullyTransformPackagesRegExp?.test(args.path)
      ) {
        source = await transformWithBabel(source, args, {
          // follow babelrc of react-native project's root (same as metro)
          babelrc: true,
        });
      }

      source = await transformWithSwc(source, args);

      if (cacheEnabled) {
        await cache.writeToFileSystem(hash, source);
      }

      return source;
    };

    build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
      const { contents, fromCache, hash } = await getTransformedSourceFromCache(
        args,
      );
      const usingCache = fromCache && cacheEnabled;

      if (usingCache) {
        logger.debug(
          `(${NAME}) transform cache hit: ${args.path.replace(
            workingDirectory,
            '',
          )}`,
        );
      }

      return {
        contents: fromCache
          ? contents
          : await transformSource(args, contents, hash),
        loader: 'js',
      } as OnLoadResult;
    });
  },
});
