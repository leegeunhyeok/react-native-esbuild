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

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Error or BundleTaskSignal
const handleBundleError = (errorOrSignal: any): void => {
  switch (errorOrSignal) {
    case BundleTaskSignal.EmptyOutput:
      logger.error('bundle result is empty');
      break;
    case BundleTaskSignal.InvalidTask:
      logger.error('bundle task is invalid');
      break;
    case BundleTaskSignal.BuildFailed:
      logger.error('build failed');
      break;
    default:
      logger.error('unable to get bundle', errorOrSignal as Error);
  }
};

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
      handleBundleError(errorOrSignal);
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
      handleBundleError(errorOrSignal);
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

    try {
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
    } catch (error) {
      logger.warn('invalid bundle request');
      response.writeHead(400).end();
    }
  };
};
