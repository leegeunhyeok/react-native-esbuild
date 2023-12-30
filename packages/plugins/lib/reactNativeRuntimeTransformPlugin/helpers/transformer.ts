import {
  getCacheKey,
  type ScopedTransformContext,
  type BuildContext,
} from '@react-native-esbuild/shared';
import {
  getTransformedCodeFromFileSystemCache,
  getTransformedCodeFromInMemoryCache,
  writeTransformedCodeToFileSystemCache,
  writeTransformedCodeToInMemoryCache,
} from './caches';

/**
 * Returns an enhanced transformer.
 *
 * - Caching
 */
export const enhanceTransformer = (
  buildContext: BuildContext,
): BuildContext['transformer'] => {
  const findCacheBeforeTransform = async (
    code: string,
    context: ScopedTransformContext,
  ): Promise<{ code: string; hit: boolean }> => {
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
      return { code: inMemoryCache, hit: true };
    }

    // 2. Transform code on each build task when cache is disabled.
    if (!buildContext.flags.cacheEnabled) {
      return { code, hit: false };
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

    return { code: cachedCode ?? code, hit: Boolean(cachedCode) };
  };

  const writeCacheAfterTransform = async (
    code: string,
    context: ScopedTransformContext,
  ): Promise<void> => {
    writeTransformedCodeToInMemoryCache(
      buildContext.cacheStorage,
      code,
      context.path,
      context.pluginData.mtimeMs,
    );

    if (buildContext.flags.cacheEnabled) {
      await writeTransformedCodeToFileSystemCache(
        buildContext.cacheStorage,
        code,
        context.pluginData.hash,
      );
    }
  };

  return async (code, context) => {
    // 1. Cache hit.
    const result = await findCacheBeforeTransform(code, context);
    if (result.hit) return result.code;

    // 2. No hit.
    code = await buildContext.transformer(code, context);
    writeCacheAfterTransform(code, context);
    return code;
  };
};
