import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { GLOBAL_CACHE_DIR } from '@react-native-esbuild/config';
import { logger } from '../shared';
import { CacheController } from './CacheController';

export class CacheStorage {
  private static instance: CacheStorage | null = null;
  private caches = new Map<number, CacheController>();

  public static getCacheDirectory(): string {
    return path.join(os.tmpdir(), GLOBAL_CACHE_DIR);
  }

  public static getInstance(): CacheStorage {
    if (CacheStorage.instance === null) {
      CacheStorage.instance = new CacheStorage();
    }
    return CacheStorage.instance;
  }

  private constructor() {
    const cacheDirectory = CacheStorage.getCacheDirectory();
    try {
      fs.accessSync(cacheDirectory, fs.constants.R_OK | fs.constants.W_OK);
    } catch (_error) {
      logger.debug('cache directory is not exist or no access permission');
      fs.mkdirSync(cacheDirectory, { recursive: true });
    }
  }

  public get(key: number): CacheController {
    if (this.caches.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- has()
      return this.caches.get(key)!;
    }

    const controller = new CacheController(CacheStorage.getCacheDirectory());
    this.caches.set(key, controller);

    return controller;
  }

  public clearAll(): Promise<void> {
    for (const controller of this.caches.values()) {
      controller.reset();
    }
    return fs.promises.rm(CacheStorage.getCacheDirectory(), {
      recursive: true,
    });
  }
}
