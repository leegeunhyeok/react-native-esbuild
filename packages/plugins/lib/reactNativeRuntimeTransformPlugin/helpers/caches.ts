import type { CacheStorage } from '@react-native-esbuild/shared';

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
