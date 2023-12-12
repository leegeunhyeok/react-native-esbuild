import type { AsyncTransformStep } from '@react-native-esbuild/transformer';
import {
  getCacheKey,
  type BuildContext,
  type CacheStorage,
} from '@react-native-esbuild/shared';

export const getCachingSteps = (
  buildContext: BuildContext,
): {
  beforeTransform: AsyncTransformStep;
  afterTransform: AsyncTransformStep;
} => {
  const findCacheBeforeTransform: AsyncTransformStep = async (
    code,
    context,
  ) => {
    /**
     * 1. Use previous transformed result and skip transform
     *    when file is not changed and transform result exist in memory.
     */
    const inMemoryCache = getTransformedCodeFromInMemoryCache(
      buildContext.cacheStorage,
      context.path,
      context.pluginData.mtimeMs,
    );
    if (inMemoryCache) {
      return { code: inMemoryCache, done: true };
    }

    // 2. Transform code on each build task when cache is disabled.
    if (!buildContext.config.cache) {
      return { code, done: false };
    }

    // 3. Trying to get cache from file system.
    //    = cache exist ? use cache : transform code
    const cachedCode = await getTransformedCodeFromFileSystemCache(
      buildContext.cacheStorage,
      (context.pluginData.hash = getCacheKey(
        buildContext.id,
        context.path,
        context.pluginData.mtimeMs,
      )),
    );

    return { code: cachedCode ?? code, done: Boolean(cachedCode) };
  };

  const writeCacheAfterTransform: AsyncTransformStep = async (
    code,
    context,
  ) => {
    writeTransformedCodeToInMemoryCache(
      buildContext.cacheStorage,
      code,
      context.path,
      context.pluginData.mtimeMs,
    );

    if (buildContext.config.cache) {
      await writeTransformedCodeToFileSystemCache(
        buildContext.cacheStorage,
        code,
        context.pluginData.hash,
      );
    }

    return { code, done: true };
  };

  return {
    beforeTransform: findCacheBeforeTransform,
    afterTransform: writeCacheAfterTransform,
  };
};

export const getTransformedCodeFromInMemoryCache = (
  transformCacheStorage: CacheStorage,
  filePath: string,
  mtimeMs: number,
): string | null => {
  const inMemoryCache = transformCacheStorage.readFromMemory(filePath);
  // If file is not modified, use cache data instead.
  return inMemoryCache && inMemoryCache.mtimeMs === mtimeMs
    ? inMemoryCache.data
    : null;
};

export const getTransformedCodeFromFileSystemCache = async (
  transformCacheStorage: CacheStorage,
  key: string,
): Promise<string | null> => {
  const fileCache = await transformCacheStorage.readFromFileSystem(key);
  return fileCache ?? null;
};

export const writeTransformedCodeToInMemoryCache = (
  transformCacheStorage: CacheStorage,
  data: string,
  key: string,
  mtimeMs: number,
): void => {
  transformCacheStorage.writeToMemory(key, { data, mtimeMs });
};

export const writeTransformedCodeToFileSystemCache = (
  transformCacheStorage: CacheStorage,
  data: string,
  key: string,
): Promise<void> => {
  return transformCacheStorage.writeToFileSystem(key, data);
};
