import { parse } from 'node:url';
import { BundleTaskSignal } from '@react-native-esbuild/core';
import {
  parseStackFromRawBody,
  symbolicateStackTrace,
} from '@react-native-esbuild/symbolicate';
import { logger } from '../shared';
import { parseBundleConfigFromRequestUrl } from '../helpers';
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
      const { bundleConfig } = parseBundleConfigFromRequestUrl(
        targetStack.file,
      );

      if (!bundleConfig) {
        throw new Error();
      }

      bundler
        .getSourcemap(bundleConfig)
        .then(({ sourcemap }) => symbolicateStackTrace(sourcemap, stack))
        .then((symbolicateResult) => {
          response.writeHead(200).end(JSON.stringify(symbolicateResult));
        })
        .catch((errorOrSignal) => {
          if (errorOrSignal === BundleTaskSignal.EmptyOutput) {
            logger.error('bundle result is empty');
          } else {
            logger.error('symbolicate error', errorOrSignal as Error);
          }
          response.writeHead(500).end();
        });
    } catch (error) {
      logger.error('invalid payload');
      response.writeHead(400).end();
    }
  };
};
