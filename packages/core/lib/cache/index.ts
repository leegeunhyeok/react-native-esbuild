import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import md5 from 'md5';
import type { Cache } from '../types';

const OPTIONS = { encoding: 'utf-8' } as const;

export class CacheManager {
  private cache = new Map<string, Cache>();

  public static getCacheDirectory(filename?: string): string {
    return path.join(os.tmpdir(), 'react-native-esbuild', filename ?? '');
  }

  constructor() {
    const cacheDirectory = CacheManager.getCacheDirectory();

    try {
      fs.accessSync(
        cacheDirectory,
        // eslint-disable-next-line no-bitwise
        fs.constants.R_OK | fs.constants.W_OK,
      );
    } catch (_error) {
      fs.mkdirSync(CacheManager.getCacheDirectory(), { recursive: true });
    }
  }

  public getCacheHash(data: object): string {
    return md5(JSON.stringify(data));
  }

  public readFromMemory(key: string): Cache | undefined {
    return this.cache.get(key);
  }

  public readFromFileSystem(hash: string): Promise<string | null> {
    return fs.promises
      .readFile(CacheManager.getCacheDirectory(hash), OPTIONS)
      .catch(() => null);
  }

  public writeToMemory(key: string, cacheData: Cache): void {
    this.cache.set(key, cacheData);
  }

  public writeToFileSystem(hash: string, data: string): Promise<void> {
    return fs.promises
      .writeFile(CacheManager.getCacheDirectory(hash), data, OPTIONS)
      .catch(() => void 0);
  }

  public clear(): Promise<void> {
    this.cache.clear();
    return fs.promises.rm(CacheManager.getCacheDirectory(), {
      recursive: true,
    });
  }
}
