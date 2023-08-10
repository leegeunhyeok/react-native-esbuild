import { parse } from 'node:url';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import type { ParsedBundleConfig } from '../helpers';
import {
  toSafetyMiddleware,
  parseBundleConfigFromSearchParams,
} from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-bundle-middleware';

export const createServeBundleMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return toSafetyMiddleware(
    function serveBundleMiddleware(request, response, next) {
      if (!request.url) {
        logger.warn(`(${TAG}) request url is empty`);
        return next();
      }

      const { pathname, query } = parse(request.url, true);

      if (!pathname?.endsWith('.bundle')) {
        return next();
      }

      let bundleConfig: ParsedBundleConfig;
      try {
        bundleConfig = parseBundleConfigFromSearchParams(query);
      } catch (_error) {
        return response.writeHead(400).end();
      }

      bundler
        .getBundle(bundleConfig)
        .then((bundle) => {
          logger.debug('bundle loaded');
          response
            .writeHead(200, { 'Content-Type': 'application/javascript' })
            .end(bundle);
        })
        .catch((errorOrSignal) => {
          if (errorOrSignal === BundleTaskSignal.EmptyOutput) {
            logger.error('bundle result is empty');
          } else {
            logger.error('unable to get bundle', errorOrSignal as Error);
          }
          response.writeHead(500).end();
        });
    },
  );
};
