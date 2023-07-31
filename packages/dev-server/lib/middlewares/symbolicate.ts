import { toSafetyMiddleware } from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'symbolicate-middleware';

export const createSymbolicateMiddleware: DevServerMiddlewareCreator = (
  _context,
) => {
  return toSafetyMiddleware(
    function symbolicateMiddleware(request, _response, next) {
      if (!request.url) {
        logger.warn(`(${TAG}) request url is empty`);
        return next();
      }

      // TODO

      return next();
    },
  );
};
