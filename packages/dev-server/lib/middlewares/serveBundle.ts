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

enum BundleType {
  Unknown,
  Bundle,
  Sourcemap,
}

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
    .getBundle(bundleConfig)
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
    .getSourcemap(bundleConfig, { disableRefresh: true })
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

const parseBundleConfig = (
  url: string,
): {
  type: BundleType;
  bundleConfig: ParsedBundleConfig | null;
} => {
  const { pathname, query } = parse(url, true);

  if (typeof pathname !== 'string') {
    return {
      type: BundleType.Unknown,
      bundleConfig: null,
    };
  }

  // eslint-disable-next-line no-nested-ternary
  const type = pathname.endsWith('.bundle')
    ? BundleType.Bundle
    : pathname.endsWith('.map')
    ? BundleType.Sourcemap
    : BundleType.Unknown;

  return {
    type,
    bundleConfig:
      type === BundleType.Unknown
        ? null
        : parseBundleConfigFromSearchParams(query),
  };
};

export const createServeBundleMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return function serveBundleMiddleware(request, response, next) {
    if (!request.url) {
      logger.warn(`(${TAG}) request url is empty`);
      return next();
    }

    const { type, bundleConfig } = parseBundleConfig(request.url);
    if (type === BundleType.Unknown || bundleConfig === null) {
      return next();
    }

    switch (type) {
      case BundleType.Bundle:
        serveBundle(bundler, bundleConfig, request, response);
        break;

      case BundleType.Sourcemap:
        serveSourcemap(bundler, bundleConfig, request, response);
        break;
    }
  };
};
