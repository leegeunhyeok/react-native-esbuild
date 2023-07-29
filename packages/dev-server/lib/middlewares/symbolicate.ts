import { toSafetyMiddleware } from '../helpers';
import type { DevServerMiddlewareCreator } from '../types';

export const createSymbolicateMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return toSafetyMiddleware(
    function symbolicateMiddleware(request, _response, next) {
      if (!request.url) {
        console.warn('[symbolicateMiddleware] request url is empty');
        return next();
      }

      // TODO

      return next();
    },
  );
};
