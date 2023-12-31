import type { Stats } from 'node:fs';
import * as chokidar from 'chokidar';
import {
  SOURCE_EXTENSIONS,
  ASSET_EXTENSIONS,
} from '@react-native-esbuild/internal';
import { logger } from '../shared';

const WATCH_EXTENSIONS_REGEXP = new RegExp(
  `(?:${[...SOURCE_EXTENSIONS, ...ASSET_EXTENSIONS].join('|')})$`,
);

export class FileSystemWatcher {
  public static DEBOUNCE_DELAY = 300;
  private static instance: FileSystemWatcher | null = null;
  private watcher: chokidar.FSWatcher | null = null;
  private debounceTimer?: NodeJS.Timeout;
  private onWatch?: (event: string, path: string, stats?: Stats) => void;

  private constructor() {
    /* Empty constructor */
  }

  public static getInstance(): FileSystemWatcher {
    if (FileSystemWatcher.instance === null) {
      FileSystemWatcher.instance = new FileSystemWatcher();
    }
    return FileSystemWatcher.instance;
  }

  private handleWatch(event: string, path: string, stats?: Stats): void {
    if (
      this.debounceTimer !== undefined ||
      !WATCH_EXTENSIONS_REGEXP.test(path)
    ) {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = undefined;
      this.onWatch?.(event, path, stats);
      logger.debug('changes detected by watcher', { event, path });
    }, FileSystemWatcher.DEBOUNCE_DELAY);
  }

  setHandler(
    handler: (event: string, path: string, stats?: Stats) => void,
  ): this {
    this.onWatch = handler;
    return this;
  }

  watch(targetPath: string): Promise<void> {
    if (this.watcher) {
      logger.debug('already watching');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.watcher = chokidar
        .watch(targetPath, {
          alwaysStat: true,
          ignoreInitial: true,
          ignored: /(?:^|[/\\])\../,
        })
        .on('addDir', (path, stats) => {
          this.handleWatch('addDir', path, stats);
        })
        .on('unlinkDir', (path) => {
          this.handleWatch('unlinkDir', path);
        })
        .on('add', (path, stats) => {
          this.handleWatch('add', path, stats);
        })
        .on('change', (path, stats) => {
          this.handleWatch('change', path, stats);
        })
        .on('unlink', (path) => {
          this.handleWatch('unlink', path);
        })
        .on('ready', () => {
          logger.debug('ready for watching', { targetPath });
          resolve();
        })
        .on('error', (error) => {
          logger.error('unexpected error on watcher', error);
        });
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
