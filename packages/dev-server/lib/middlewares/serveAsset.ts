import { toSafetyMiddleware } from '../helpers';
import type { DevServerMiddlewareCreator } from '../types';

export const createServeAssetMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return toSafetyMiddleware(
    function serveAssetMiddleware(request, _response, next) {
      if (!request.url) {
        console.warn('[serveAssetMiddleware] request url is empty');
        return next();
      }

      // TODO

      return next();
    },
  );
};
