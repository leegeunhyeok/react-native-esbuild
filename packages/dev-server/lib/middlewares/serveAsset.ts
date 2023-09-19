import fs, { type FileHandle } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import mime from 'mime';
import {
  getDevServerAssetPath,
  ASSET_PATH,
} from '@react-native-esbuild/config';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-asset-middleware';

export const createServeAssetMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return function serveAssetMiddleware(request, response, next) {
    if (
      !(typeof request.url === 'string' && request.url.startsWith(ASSET_PATH))
    ) {
      next();
      return;
    }

    const filename = url.parse(path.basename(request.url)).pathname;

    if (!filename) {
      logger.warn(`(${TAG}) unable to resolve asset name: ${request.url}`);
      return response.writeHead(400).end();
    }

    const filepath = path.join(getDevServerAssetPath(), filename);
    let fileHandle: FileHandle | undefined;

    fs.open(filepath, 'r')
      .then((handle) => (fileHandle = handle).stat())
      .then((stats) =>
        stats.isDirectory()
          ? Promise.reject(new Error('is directory'))
          : stats.size,
      )
      .then((size) => ({
        'Content-Type': mime.getType(filepath) ?? '',
        'Content-Length': size,
      }))
      .then((headers) => {
        return fileHandle?.readFile().then((data) => {
          response.writeHead(200, headers).end(data);
        });
      })
      .catch((error) => {
        logger.error(`unable to serve asset: ${filename}`, error as Error);
        response.writeHead(500).end();
      })
      .finally(() => void fileHandle?.close());
  };
};
