import { parse } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type {
  BundlerEventListener,
  ReactNativeEsbuildBundler,
} from '@react-native-esbuild/core';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import { getIdByOptions } from '@react-native-esbuild/config';
import type { ParsedBundleConfig } from '../helpers';
import { parseBundleConfigFromSearchParams, BundleResponse } from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-bundle-middleware';

const serveBundle = (
  bundler: ReactNativeEsbuildBundler,
  bundleConfig: ParsedBundleConfig,
  request: IncomingMessage,
  response: ServerResponse,
): void => {
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

const serveSourcemap = (
  bundler: ReactNativeEsbuildBundler,
  bundleConfig: ParsedBundleConfig,
  _request: IncomingMessage,
  response: ServerResponse,
): void => {
  bundler
    .getSourcemap(bundleConfig)
    .then((result) => {
      response.setHeader('Access-Control-Allow-Origin', 'devtools://devtools');
      response.setHeader('Content-Type', 'application/javascript');
      response.writeHead(200).end(result.sourcemap);
    })
    .catch((errorOrSignal) => {
      if (errorOrSignal === BundleTaskSignal.EmptyOutput) {
        logger.error('bundle result is empty');
      } else {
        logger.error('unable to get sourcemap', errorOrSignal as Error);
      }
      response.writeHead(500).end();
    });
};

export const createServeBundleMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return function serveBundleMiddleware(request, response, next) {
    if (!request.url) {
      logger.warn(`(${TAG}) request url is empty`);
      return next();
    }

    const { pathname, query } = parse(request.url, true);

    let bundleConfig: ParsedBundleConfig;
    try {
      bundleConfig = parseBundleConfigFromSearchParams(query);
    } catch (_error) {
      return response.writeHead(400).end();
    }

    switch (true) {
      case pathname?.endsWith('.bundle'):
        serveBundle(bundler, bundleConfig, request, response);
        break;

      case pathname?.endsWith('.map'):
        serveSourcemap(bundler, bundleConfig, request, response);
        break;

      default:
        next();
        break;
    }
  };
};
