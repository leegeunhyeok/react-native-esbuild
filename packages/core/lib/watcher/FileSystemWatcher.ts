import path from 'node:path';
import type { Stats } from 'node:fs';
import * as chokidar from 'chokidar';
import {
  SOURCE_EXTENSIONS,
  ASSET_EXTENSIONS,
} from '@react-native-esbuild/internal';
import { LOCAL_CACHE_DIR } from '@react-native-esbuild/config';
import { logger } from '../shared';

const WATCH_EXTENSIONS_REGEXP = new RegExp(
  `(?:${[...SOURCE_EXTENSIONS, ...ASSET_EXTENSIONS].join('|')})$`,
);

export class FileSystemWatcher {
  private static instance: FileSystemWatcher | null = null;
  private watcher: chokidar.FSWatcher | null = null;
  private onWatch?: (path: string, stats?: Stats) => void;

  private constructor() {
    // empty constructor
  }

  public static getInstance(): FileSystemWatcher {
    if (FileSystemWatcher.instance === null) {
      FileSystemWatcher.instance = new FileSystemWatcher();
    }
    return FileSystemWatcher.instance;
  }

  private handleWatch(path: string, stats?: Stats): void {
    logger.debug('event received from watcher', { path });
    if (!WATCH_EXTENSIONS_REGEXP.test(path)) {
      return;
    }
    this.onWatch?.(path, stats);
  }

  setHandler(handler: (path: string, stats?: Stats) => void): this {
    this.onWatch = handler;
    return this;
  }

  watch(targetPath: string): void {
    if (this.watcher) {
      logger.debug('already watching');
      return;
    }

    const ignoreDirectories = [path.join(targetPath, LOCAL_CACHE_DIR)];

    this.watcher = chokidar
      .watch(targetPath, {
        alwaysStat: true,
        ignoreInitial: true,
        ignored: ignoreDirectories,
      })
      .on('add', this.handleWatch.bind(this) as typeof this.handleWatch)
      .on('addDir', this.handleWatch.bind(this) as typeof this.handleWatch)
      .on('change', this.handleWatch.bind(this) as typeof this.handleWatch)
      .on('unlink', this.handleWatch.bind(this) as typeof this.handleWatch)
      .on('unlinkDir', this.handleWatch.bind(this) as typeof this.handleWatch)
      .on('ready', () => {
        logger.debug(`watching '${targetPath}'`);
      })
      .on('error', (error) => {
        logger.error('unexpected error on watcher', error);
      });
  }

  close(): void {
    if (!this.watcher) {
      logger.debug('not watching');
      return;
    }
    this.watcher.close();
    this.watcher = null;
  }
}
