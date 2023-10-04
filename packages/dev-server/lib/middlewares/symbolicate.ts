import { parse } from 'node:url';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import {
  parseStackFromRawBody,
  symbolicateStackTrace,
} from '@react-native-esbuild/symbolicate';
import { logger } from '../shared';
import { parseBundleOptionsFromRequestUrl } from '../helpers';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'symbolicate-middleware';

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
        .getSourcemap(bundleOptions)
        .then(({ sourcemap }) =>
          symbolicateStackTrace(sourcemap, stack).catch((error) => {
            logger.debug('unable to symbolicate stack trace', {
              error: error as Error,
            });
            return { stack: [], codeFrame: null };
          }),
        )
        .then((symbolicateResult) => {
          response.writeHead(200).end(JSON.stringify(symbolicateResult));
        })
        .catch((errorOrSignal) => {
          if (errorOrSignal === BundleTaskSignal.EmptyOutput) {
            logger.warn('bundle result is empty');
          } else if (errorOrSignal === BundleTaskSignal.InvalidTask) {
            logger.warn('bundle task is invalid');
          } else {
            logger.error('symbolicate error', errorOrSignal as Error);
          }
          response.writeHead(500).end();
        });
    } catch (error) {
      logger.warn('invalid symbolicate request');
      response.writeHead(400).end();
    }
  };
};
