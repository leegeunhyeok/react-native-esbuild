import fs from 'node:fs/promises';
import type { Stats } from 'node:fs';
import type { OnLoadArgs } from 'esbuild';
import type {
  CacheController,
  PluginContext,
} from '@react-native-esbuild/core';
import type { CacheConfig } from '../../types';

/**
 * Generate hash that contains the file path, modification time, and bundle options.
 *
 * `id` is combined(platform, dev, minify) bundle options value in `@react-native-esbuild`.
 *
 * hash = md5(id + modified time + file path)
 *            number + number    + string
 */
export const makeCacheConfig = async (
  controller: CacheController,
  args: OnLoadArgs,
  context: PluginContext,
  stats?: Stats,
): Promise<CacheConfig> => {
  const mtimeMs = (stats ?? (await fs.stat(args.path))).mtimeMs;
  return {
    hash: controller.getCacheHash(context.id + mtimeMs + args.path),
    mtimeMs,
  };
};

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
