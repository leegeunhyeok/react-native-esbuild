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
  public static DEBOUNCE_DELAY = 300;
  private static instance: FileSystemWatcher | null = null;
  private watcher: chokidar.FSWatcher | null = null;
  private onWatch?: (event: string, path: string, stats?: Stats) => void;
  private debounceTimer?: NodeJS.Timeout;

  private constructor() {
    // empty constructor
  }

  public static getInstance(): FileSystemWatcher {
    if (FileSystemWatcher.instance === null) {
      FileSystemWatcher.instance = new FileSystemWatcher();
    }
    return FileSystemWatcher.instance;
  }

  private handleWatch(event: string, path: string, stats?: Stats): void {
    logger.debug('event received from watcher', { path });
    if (
      this.debounceTimer !== undefined ||
      !WATCH_EXTENSIONS_REGEXP.test(path)
    ) {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = undefined;
      this.onWatch?.(event, path, stats);
    }, FileSystemWatcher.DEBOUNCE_DELAY);
  }

  setHandler(
    handler: (event: string, path: string, stats?: Stats) => void,
  ): this {
    this.onWatch = handler;
    return this;
  }

  watch(targetPath: string): void {
    if (this.watcher) {
      logger.debug('already watching');
      return;
    }

    const ignoreDirectories = [path.join(targetPath, LOCAL_CACHE_DIR)];

    const addListener = (
      event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    ): void => {
      if (!this.watcher) return;
      this.watcher.on(event, (path, stats) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- allow
        this.handleWatch(event, path, stats);
      });
    };

    this.watcher = chokidar
      .watch(targetPath, {
        alwaysStat: true,
        ignoreInitial: true,
        ignored: ignoreDirectories,
      })
      .on('ready', () => {
        logger.debug(`watching '${targetPath}'`);
      })
      .on('error', (error) => {
        logger.error('unexpected error on watcher', error);
      });

    addListener('addDir');
    addListener('unlinkDir');
    addListener('add');
    addListener('change');
    addListener('unlink');
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
