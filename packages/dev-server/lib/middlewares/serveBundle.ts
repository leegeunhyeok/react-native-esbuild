import type { IncomingMessage, ServerResponse } from 'node:http';
import type {
  BundlerEventListener,
  ReactNativeEsbuildBundler,
} from '@react-native-esbuild/core';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import { getIdByOptions } from '@react-native-esbuild/config';
import type { ParsedBundleOptions } from '../helpers';
import { BundleResponse, parseBundleOptionsFromRequestUrl } from '../helpers';
import { logger } from '../shared';
import { BundleRequestType, type DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-bundle-middleware';

const serveBundle = (
  bundler: ReactNativeEsbuildBundler,
  bundleOptions: ParsedBundleOptions,
  request: IncomingMessage,
  response: ServerResponse,
): void => {
  const bundleResponse = new BundleResponse(response, request.headers.accept);
  const currentId = getIdByOptions(bundleOptions);

  const bundleStatusChangeHandler: BundlerEventListener<
    'build-status-change'
  > = ({ id, loaded, total }) => {
    if (id !== currentId) return;
    bundleResponse.writeBundleState(loaded, total);
  };

  bundler.on('build-status-change', bundleStatusChangeHandler);
  bundler
    .getBundle(bundleOptions)
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
  bundleOptions: ParsedBundleOptions,
  _request: IncomingMessage,
  response: ServerResponse,
): void => {
  bundler
    .getSourcemap(bundleOptions, { disableRefresh: true })
    .then((result) => {
      response.setHeader('Access-Control-Allow-Origin', 'devtools://devtools');
      response.setHeader('Content-Type', 'application/json');
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
      next();
      return;
    }

    const { type, bundleOptions } = parseBundleOptionsFromRequestUrl(
      request.url,
    );
    if (type === BundleRequestType.Unknown || bundleOptions === null) {
      next();
      return;
    }

    switch (type) {
      case BundleRequestType.Bundle:
        serveBundle(bundler, bundleOptions, request, response);
        break;

      case BundleRequestType.Sourcemap:
        serveSourcemap(bundler, bundleOptions, request, response);
        break;
    }
  };
};
