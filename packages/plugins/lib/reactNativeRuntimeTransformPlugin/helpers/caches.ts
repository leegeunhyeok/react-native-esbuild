import fs from 'node:fs/promises';
import type { OnLoadArgs } from 'esbuild';
import type {
  CacheController,
  PluginContext,
} from '@react-native-esbuild/core';

export const getTransformedCodeFromCache = async (
  controller: CacheController,
  args: OnLoadArgs,
  context: PluginContext,
): Promise<{
  code: string | null;
  hash: string;
  mtimeMs: number;
}> => {
  /**
   * `id` is combined value (platform, dev, minify)
   * use `id` as filesystem hash key generation
   *
   * md5(id + modified time + file path) = cache key
   *     number + number        + string
   */
  const { mtimeMs } = await fs.stat(args.path);
  const hash = controller.getCacheHash(context.id + mtimeMs + args.path);
  const inMemoryCache = controller.readFromMemory(hash);

  const makeReturnValue = (
    data: string | null,
  ): {
    code: string | null;
    hash: string;
    mtimeMs: number;
  } => {
    return { code: data, hash, mtimeMs };
  };

  // 1. find cache from memory
  if (inMemoryCache) {
    if (inMemoryCache.modifiedAt === mtimeMs) {
      // file is not modified, using cache data
      return makeReturnValue(inMemoryCache.data);
    }
    return makeReturnValue(null);
  }

  const fsCache = await controller.readFromFileSystem(hash);

  // 2. find cache from file system
  if (fsCache) {
    controller.writeToMemory(hash, {
      data: fsCache,
      modifiedAt: mtimeMs,
    });
    return makeReturnValue(fsCache);
  }

  // 3. cache not found
  return makeReturnValue(null);
};

export const writeTransformedCodeToCache = async (
  controller: CacheController,
  code: string,
  hash: string,
  mtimeMs: number,
): Promise<void> => {
  controller.writeToMemory(hash, {
    data: code,
    modifiedAt: mtimeMs,
  });
  await controller.writeToFileSystem(hash, code);
};
