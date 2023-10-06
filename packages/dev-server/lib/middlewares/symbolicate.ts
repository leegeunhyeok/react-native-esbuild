import { parse } from 'node:url';
import {
  ReactNativeEsbuildError,
  ReactNativeEsbuildErrorCode,
} from '@react-native-esbuild/core';
import {
  parseStackFromRawBody,
  symbolicateStackTrace,
} from '@react-native-esbuild/symbolicate';
import { logger } from '../shared';
import { parseBundleOptionsFromRequestUrl } from '../helpers';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'symbolicate-middleware';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- error
const handleError = (error: any): void => {
  if (error instanceof ReactNativeEsbuildError) {
    switch (error.code) {
      case ReactNativeEsbuildErrorCode.InvalidTask:
        logger.error('bundle task is invalid');
        break;
      case ReactNativeEsbuildErrorCode.BuildFailure:
        logger.error('build failed');
        break;
      default:
        logger.error('internal error', error as Error);
    }
  } else {
    logger.error('symbolicate error', error as Error);
  }
};

export const createSymbolicateMiddleware: DevServerMiddlewareCreator = ({
  bundler,
}) => {
  return function symbolicateMiddleware(request, response, next) {
    if (!request.url) {
      logger.warn(`(${TAG}) request url is empty`);
      next();
      return;
    }

    const { pathname } = parse(request.url, true);
    if (!pathname?.endsWith('/symbolicate')) {
      next();
      return;
    }

    const stack = parseStackFromRawBody(request.rawBody);
    const targetStack = stack.find(({ file }) => file.startsWith('http'));

    if (!targetStack) {
      throw new Error('unable to processing');
    }

    try {
      const { bundleOptions } = parseBundleOptionsFromRequestUrl(
        targetStack.file,
      );

      if (!bundleOptions) {
        throw new Error();
      }

      bundler
        .getBundle(bundleOptions)
        .then(({ result, error }) => {
          if (error) throw error;
          return symbolicateStackTrace(result.sourcemap, stack).catch(
            (error) => {
              logger.debug('unable to symbolicate stack trace', {
                error: error as Error,
              });
              return { stack: [], codeFrame: null };
            },
          );
        })
        .then((symbolicateResult) => {
          response.writeHead(200).end(JSON.stringify(symbolicateResult));
        })
        .catch((error) => {
          handleError(error);
          response.writeHead(500).end();
        });
    } catch (error) {
      logger.warn('invalid symbolicate request');
      response.writeHead(400).end();
    }
  };
};
