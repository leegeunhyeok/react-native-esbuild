import { z } from 'zod';
import type { DevServerMiddleware } from '../types';

type ParsedBundlerOptions = z.infer<typeof bundleSearchParamSchema>;

const toBoolean = (val: z.infer<typeof boolean>): boolean => val === 'true';

const boolean = z.union([z.literal('true'), z.literal('false')]);
const bundleSearchParamSchema = z
  .object({
    // required
    platform: z.union([
      z.literal('android'),
      z.literal('ios'),
      z.literal('web'),
    ]),
    // optional
    dev: boolean.default('true').transform(toBoolean),
    minify: boolean.default('false').transform(toBoolean),
    runModule: boolean.default('false').transform(toBoolean),
  })
  .required();

export function parseBundleOptionsFromSearchParams(
  searchParams: URLSearchParams,
): ParsedBundlerOptions {
  const platform = searchParams.get('platform');
  const dev = searchParams.get('dev');
  const minify = searchParams.get('minify');
  const runModule = searchParams.get('runModule');

  return bundleSearchParamSchema.parse({
    platform,
    dev,
    minify,
    runModule,
  });
}

export function toSafetyMiddleware(
  middleware: DevServerMiddleware,
): DevServerMiddleware {
  return function wrap(request, response, next) {
    try {
      middleware(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}
