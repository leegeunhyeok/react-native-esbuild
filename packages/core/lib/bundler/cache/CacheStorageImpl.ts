import fs from 'node:fs';
import path from 'node:path';
import {
  GLOBAL_CACHE_DIR,
  type Cache,
  type CacheStorage,
} from '@react-native-esbuild/shared';

const OPTIONS = { encoding: 'utf-8' } as const;

export class CacheStorageImpl implements CacheStorage {
  private cache: Record<string, Cache> = {};

  public static clearAll(): Promise<void> {
    return fs.promises.rm(GLOBAL_CACHE_DIR, {
      recursive: true,
    });
  }

  constructor() {
    try {
      fs.accessSync(GLOBAL_CACHE_DIR, fs.constants.R_OK | fs.constants.W_OK);
    } catch (_error) {
      fs.mkdirSync(GLOBAL_CACHE_DIR, { recursive: true });
    }
  }

  public readFromMemory(key: string): Cache | undefined {
    return this.cache[key];
  }

  public readFromFileSystem(key: string): Promise<string | undefined> {
    return fs.promises
      .readFile(path.join(GLOBAL_CACHE_DIR, key), OPTIONS)
      .catch(() => undefined);
  }

  public writeToMemory(key: string, cacheData: Cache): void {
    this.cache[key] = cacheData;
  }

  public writeToFileSystem(key: string, data: string): Promise<void> {
    return fs.promises
      .writeFile(path.join(GLOBAL_CACHE_DIR, key), data, OPTIONS)
      .catch(() => void 0);
  }

  public reset(): void {
    this.cache = {};
  }
}
