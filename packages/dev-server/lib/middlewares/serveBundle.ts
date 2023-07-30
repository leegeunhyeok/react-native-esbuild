import {
  BundleTaskSignal,
  type BundleRequestOptions,
} from '@react-native-esbuild/core';
import {
  toSafetyMiddleware,
  parseBundleOptionsFromSearchParams,
} from '../helpers';
import type { DevServerMiddlewareCreator } from '../types';

export const createServeBundleMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return toSafetyMiddleware(
    function serveBundleMiddleware(request, response, next) {
      if (!request.url) {
        console.warn('[serveBundleMiddleware] request url is empty');
        return next();
      }

      const url = new URL(request.url);

      const getBundleAndServe = (
        bundleRequestOptions: BundleRequestOptions,
      ): Promise<void> => {
        return bundler.getBundle(bundleRequestOptions).then((bundle) => {
          response
            .writeHead(200, { 'Content-Type': 'application/javascript' })
            .end(bundle);
        });
      };

      if (url.pathname.endsWith('.bundle')) {
        const bundleRequestOptions = parseBundleOptionsFromSearchParams(
          url.searchParams,
        );

        return void getBundleAndServe(bundleRequestOptions).catch(
          (errorOrSignal) => {
            if (errorOrSignal === BundleTaskSignal.WatchModeNotStarted) {
              // start bundling and watching
              // and retry to get bundle after a while
              return bundler.watch(bundleRequestOptions.platform).then(() => {
                setTimeout(
                  () => void getBundleAndServe(bundleRequestOptions),
                  500,
                );
              });
            }

            response
              .writeHead(
                500,
                errorOrSignal instanceof Error
                  ? errorOrSignal.message
                  : 'unexpected error',
              )
              .end();
          },
        );
      }

      return next();
    },
  );
};
