import fs from 'node:fs/promises';
import path from 'node:path';
import type { DevServerMiddlewareCreator } from '../types';
import { logger } from '../shared';

const TAG = 'index-page-middleware';

export const createIndexPageMiddleware: DevServerMiddlewareCreator = () => {
  return function indexPageMiddleware(request, response, next) {
    if (request.url !== '/') {
      next();
      return;
    }

    fs.readFile(path.resolve(__filename, '../../static/index.html'), {
      encoding: 'utf-8',
    })
      .then((content) => {
        response.writeHead(200, { 'Content-Type': 'text/html' }).end(content);
      })
      .catch((error) => {
        logger.error(`(${TAG}) cannot read index.html`, error as Error);
        response.writeHead(500).end();
      });
  };
};
