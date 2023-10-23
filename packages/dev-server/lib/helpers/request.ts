import { parse } from 'node:url';
import { z } from 'zod';
import type { BundleOptions } from '@react-native-esbuild/config';
import { BundleRequestType } from '../types';

export type ParsedBundleOptions = z.infer<typeof bundleSearchParamSchema>;

const toBoolean = (val: z.infer<typeof boolean>): boolean => val === 'true';

const boolean = z.union([z.literal('true'), z.literal('false')]);
const bundleSearchParamSchema = z
  .object({
    // Required field.
    platform: z.union([
      z.literal('android'),
      z.literal('ios'),
      z.literal('web'),
    ]),
    // Optional fields.
    dev: boolean.default('true').transform(toBoolean),
    minify: boolean.default('false').transform(toBoolean),
    runModule: boolean.default('false').transform(toBoolean),
  })
  .required();

export const parseBundleOptionsFromRequestUrl = (
  requestUrl: string | undefined,
): {
  type: BundleRequestType;
  bundleOptions: ParsedBundleOptions | null;
} => {
  if (!requestUrl) {
    return { type: BundleRequestType.Unknown, bundleOptions: null };
  }

  const { pathname, query } = parse(requestUrl, true);
  if (typeof pathname !== 'string') {
    return {
      type: BundleRequestType.Unknown,
      bundleOptions: null,
    };
  }

  // eslint-disable-next-line no-nested-ternary -- Allow nested ternary operator.
  const type = pathname.endsWith('.bundle')
    ? BundleRequestType.Bundle
    : pathname.endsWith('.map')
    ? BundleRequestType.Sourcemap
    : BundleRequestType.Unknown;

  return {
    type,
    bundleOptions:
      type === BundleRequestType.Unknown
        ? null
        : bundleSearchParamSchema.parse(query),
  };
};

export const parseBundleOptionsForWeb = (
  bundleOptions: Partial<BundleOptions>,
  type: 'bundle' | 'sourcemap',
): {
  type: BundleRequestType;
  bundleOptions: ParsedBundleOptions | null;
} => {
  return {
    type:
      type === 'bundle'
        ? BundleRequestType.Bundle
        : BundleRequestType.Sourcemap,
    bundleOptions: bundleSearchParamSchema.parse({
      ...Object.entries(bundleOptions).reduce((prev, [key, value]) => {
        return { ...prev, [key]: value.toString() };
      }, {}),
      platform: 'web',
    }),
  };
};
