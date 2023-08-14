import { parse } from 'node:url';
import type { BundlerEventListener } from '@react-native-esbuild/core';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import { getIdByOptions } from '@react-native-esbuild/config';
import type { ParsedBundleConfig } from '../helpers';
import { parseBundleConfigFromSearchParams, BundleResponse } from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'server-sourcemap-middleware';

export const createServeBundleMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return function serveBundleMiddleware(request, response, next) {
    if (!request.url) {
      logger.warn(`(${TAG}) request url is empty`);
      return next();
    }

    const { pathname, query } = parse(request.url, true);

    if (!pathname?.endsWith('.map')) {
      return next();
    }

    let bundleConfig: ParsedBundleConfig;
    try {
      bundleConfig = parseBundleConfigFromSearchParams(query);
    } catch (_error) {
      return response.writeHead(400).end();
    }

    const bundleResponse = new BundleResponse(response, request.headers.accept);
    const currentId = getIdByOptions({
      dev: bundleConfig.dev,
      minify: bundleConfig.minify,
      platform: bundleConfig.platform,
    });

    const bundleStatusChangeHandler: BundlerEventListener<
      'build-status-change'
    > = ({ id, loaded, resolved }) => {
      if (id !== currentId) return;
      bundleResponse.writeBundleState(loaded, resolved);
    };

    bundler.on('build-status-change', bundleStatusChangeHandler);
    bundler
      .getBundle(bundleConfig, { disableRefresh: true })
      .then((result) => {
        bundleResponse.endWithBundle(result.source, result.bundledAt);
      })
      .catch((errorOrSignal) => {
        if (errorOrSignal === BundleTaskSignal.EmptyOutput) {
          logger.error('bundle result is empty');
        } else {
          logger.error('unable to get bundle', errorOrSignal as Error);
        }
        bundleResponse.endWithError();
      })
      .finally(() => {
        bundler.off('build-status-change', bundleStatusChangeHandler);
      });
  };
};
