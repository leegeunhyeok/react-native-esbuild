import { parse } from 'node:url';
import {
  parseStackFromRawBody,
  symbolicateStackTrace,
} from '@react-native-esbuild/symbolicate';
import type { BundleOptions } from '@react-native-esbuild/config';
import {
  parseBundleOptionsForWeb,
  parseBundleOptionsFromRequestUrl,
  type ParsedBundleOptions,
} from '../helpers';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'symbolicate-middleware';

export const createSymbolicateMiddleware: DevServerMiddlewareCreator<{
  webBundleOptions?: Partial<BundleOptions>;
}> = (context, options) => {
  const bundler = context.bundler;
  const webBundleOptions = options?.webBundleOptions;

  return function symbolicateMiddleware(request, response, next) {
    if (!request.url) {
      logger.warn(`(${TAG}) request url is empty`);
      next();
      return;
    }

    const { pathname } = parse(request.url, true);
    if (!(pathname && pathname.endsWith('/symbolicate'))) {
      next();
      return;
    }

    try {
      const stack = parseStackFromRawBody(request.rawBody);
      const targetStack = stack.find(({ file }) => file.startsWith('http'));
      if (!targetStack) {
        throw new Error('unable to get symbolicate stack');
      }

      let bundleOptions: ParsedBundleOptions | null = null;
      if (webBundleOptions) {
        bundleOptions = parseBundleOptionsForWeb(
          webBundleOptions,
          'sourcemap',
        ).bundleOptions;
      } else {
        bundleOptions = parseBundleOptionsFromRequestUrl(
          targetStack.file,
        ).bundleOptions;
      }

      if (!bundleOptions) {
        throw new Error('unable to parse bundle options');
      }

      bundler
        .getBundleResult(bundleOptions)
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
          logger.error('unable to get bundle', error as Error);
          response.writeHead(500).end();
        });
    } catch (error) {
      logger.warn('invalid symbolicate request', error as Error);
      response.writeHead(400).end();
    }
  };
};
