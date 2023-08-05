import fs from 'node:fs';
import path from 'node:path';
import md5 from 'md5';
import type { Cache } from '../types';

const OPTIONS = { encoding: 'utf-8' } as const;

export class CacheController {
  private cache = new Map<string, Cache>();

  constructor(private cacheDirectory: string) {
    try {
      fs.accessSync(cacheDirectory, fs.constants.R_OK | fs.constants.W_OK);
    } catch (_error) {
      fs.mkdirSync(cacheDirectory, { recursive: true });
    }
  }

  public getCacheHash(message: string): string {
    return md5(message);
  }

  public readFromMemory(key: string): Cache | undefined {
    return this.cache.get(key);
  }

  public readFromFileSystem(hash: string): Promise<string | null> {
    return fs.promises
      .readFile(path.join(this.cacheDirectory, hash), OPTIONS)
      .catch(() => null);
  }

  public writeToMemory(key: string, cacheData: Cache): void {
    this.cache.set(key, cacheData);
  }

  public writeToFileSystem(hash: string, data: string): Promise<void> {
    return fs.promises
      .writeFile(path.join(this.cacheDirectory, hash), data, OPTIONS)
      .catch(() => void 0);
  }

  public reset(): void {
    this.cache.clear();
  }
}
