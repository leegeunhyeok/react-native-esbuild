import { parse } from 'node:url';
import {
  BundleTaskSignal,
  type BundleRequestOptions,
} from '@react-native-esbuild/core';
import type { ParsedBundlerOptions } from '../helpers';
import {
  toSafetyMiddleware,
  parseBundleOptionsFromSearchParams,
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

      const getBundleAndServe = (
        bundleRequestOptions: BundleRequestOptions,
      ): Promise<void> => {
        return bundler.getBundle(bundleRequestOptions).then((bundle) => {
          response
            .writeHead(200, { 'Content-Type': 'application/javascript' })
            .end(bundle);
        });
      };

      if (pathname?.endsWith('.bundle')) {
        let bundleRequestOptions: ParsedBundlerOptions;
        try {
          bundleRequestOptions = parseBundleOptionsFromSearchParams(query);
        } catch (_error) {
          return response.writeHead(400).end();
        }

        return void getBundleAndServe(bundleRequestOptions).catch(
          (errorOrSignal) => {
            if (errorOrSignal === BundleTaskSignal.WatchModeNotStarted) {
              logger.debug(`(${TAG}) watch mode is not started`);
              logger.debug(`(${TAG}) starting watch mode`);
              // start bundling and watching
              // and retry to get bundle after a while
              return bundler.watch(bundleRequestOptions.platform).then(() => {
                logger.debug(`(${TAG}) watch mode started`);
                setTimeout(
                  () => void getBundleAndServe(bundleRequestOptions),
                  500,
                );
              });
            }

            const error = errorOrSignal as Error;
            logger.error(
              'an unexpected error occurred while getting the bundle',
              error,
            );

            response.writeHead(500, error.message).end();
          },
        );
      }

      return next();
    },
  );
};
