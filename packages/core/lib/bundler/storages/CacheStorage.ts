import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { GLOBAL_CACHE_DIR } from '@react-native-esbuild/config';
import { logger } from '../../shared';
import { CacheController } from '../cache';
import { Storage } from './Storage';

const CACHE_DIRECTORY = path.join(os.tmpdir(), GLOBAL_CACHE_DIR);

export class CacheStorage extends Storage<CacheController> {
  constructor() {
    super();
    try {
      fs.accessSync(CACHE_DIRECTORY, fs.constants.R_OK | fs.constants.W_OK);
    } catch (_error) {
      logger.debug('cache directory is not exist or no access permission');
      fs.mkdirSync(CACHE_DIRECTORY, { recursive: true });
    }
  }

  public get(key: number): CacheController {
    if (this.data.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- has()
      return this.data.get(key)!;
    }

    const controller = new CacheController(CACHE_DIRECTORY);
    this.data.set(key, controller);

    return controller;
  }

  public clearAll(): Promise<void> {
    for (const controller of this.data.values()) {
      controller.reset();
    }
    return fs.promises.rm(CACHE_DIRECTORY, {
      recursive: true,
    });
  }
}
