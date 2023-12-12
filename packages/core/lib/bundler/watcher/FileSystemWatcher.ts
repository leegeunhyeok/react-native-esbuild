import type { Stats } from 'node:fs';
import * as chokidar from 'chokidar';
import {
  SOURCE_EXTENSIONS,
  ASSET_EXTENSIONS,
} from '@react-native-esbuild/internal';
import { logger } from '../../shared';
import type { FileSystemWatchEventListener } from '../../types';

const WATCH_EXTENSIONS_REGEXP = new RegExp(
  `(?:${[...SOURCE_EXTENSIONS, ...ASSET_EXTENSIONS].join('|')})$`,
);

export class FileSystemWatcher {
  public static DEBOUNCE_DELAY = 300;
  private watcher: chokidar.FSWatcher | null = null;
  private debounceTimer?: NodeJS.Timeout;

  constructor(private listener: FileSystemWatchEventListener) {}

  private handleWatch(event: string, path: string, stats?: Stats): void {
    if (
      this.debounceTimer !== undefined ||
      !WATCH_EXTENSIONS_REGEXP.test(path)
    ) {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = undefined;
      this.listener.onFileSystemChange(event, path, stats);
      logger.debug('changes detected by watcher', { event, path });
    }, FileSystemWatcher.DEBOUNCE_DELAY);
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
