import { toSafetyMiddleware } from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-asset-middleware';

export const createServeAssetMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return toSafetyMiddleware(
    function serveAssetMiddleware(request, _response, next) {
      if (!request.url) {
        logger.warn(`(${TAG}) request url is empty`);
        return next();
      }

      // TODO

      return next();
    },
  );
};
