import type { CacheController } from '@react-native-esbuild/core';
import type { CacheConfig } from '../../types';

export const getTransformedCodeFromInMemoryCache = (
  controller: CacheController,
  cacheConfig: CacheConfig,
): string | null => {
  const inMemoryCache = controller.readFromMemory(cacheConfig.hash);
  // If file is not modified, use cache data instead.
  return inMemoryCache && inMemoryCache.modifiedAt === cacheConfig.mtimeMs
    ? inMemoryCache.data
    : null;
};

export const getTransformedCodeFromFileSystemCache = async (
  controller: CacheController,
  cacheConfig: CacheConfig,
): Promise<string | null> => {
  const fsCache = await controller.readFromFileSystem(cacheConfig.hash);
  return fsCache ?? null;
};

export const writeTransformedCodeToInMemoryCache = (
  controller: CacheController,
  code: string,
  cacheConfig: CacheConfig,
): void => {
  controller.writeToMemory(cacheConfig.hash, {
    data: code,
    modifiedAt: cacheConfig.mtimeMs,
  });
};

export const writeTransformedCodeToFileSystemCache = (
  controller: CacheController,
  code: string,
  cacheConfig: CacheConfig,
): Promise<void> => {
  return controller.writeToFileSystem(cacheConfig.hash, code);
};
