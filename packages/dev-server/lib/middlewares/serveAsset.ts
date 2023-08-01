import path from 'node:path';
import fs, { type FileHandle } from 'node:fs/promises';
import mime from 'mime';
import { ASSET_PATH } from '@react-native-esbuild/config';
import { toSafetyMiddleware } from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-asset-middleware';

export const createServeAssetMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return toSafetyMiddleware(
    function serveAssetMiddleware(request, response, next) {
      if (!request.url) {
        logger.warn(`(${TAG}) request url is empty`);
        return next();
      }

      if (request.url.startsWith(ASSET_PATH)) {
        logger.debug(`(${TAG}) ${request.url}`);
        const filename = path.basename(request.url);
        const filepath = path.join(
          path.resolve(__dirname, '../'),
          ASSET_PATH,
          filename,
        );
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
            response.writeHead(200, headers);
            return fileHandle?.readFile();
          })
          .then((data) => response.end(data))
          .finally(() => void fileHandle?.close());

        return;
      }

      return next();
    },
  );
};
