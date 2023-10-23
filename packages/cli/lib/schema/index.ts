import path from 'node:path';
import { SUPPORT_PLATFORMS } from '@react-native-esbuild/config';
import { z } from 'zod';

const resolvePath = (filepath: string): string =>
  path.resolve(process.cwd(), filepath);

export const baseArgvSchema = z.object({
  verbose: z.boolean().optional(),
  config: z.string().optional(),
  'reset-cache': z.boolean().optional(),
});

export const startArgvSchema = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  'entry-file': z.string().transform(resolvePath).optional(),
});

export const serveArgvSchema = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  dev: z.boolean().optional(),
  minify: z.boolean().optional(),
  template: z.string().transform(resolvePath).optional(),
  'entry-file': z.string().transform(resolvePath).optional(),
});

export const bundleArgvSchema = z.object({
  /**
   * Type infer issue with using `map()`.
   *
   * ```ts
   * // not work
   * z.union(SUPPORT_PLATFORMS.map(z.literal)),
   * ```
   */
  platform: z
    .union([
      z.literal(SUPPORT_PLATFORMS[0]),
      z.literal(SUPPORT_PLATFORMS[1]),
      z.literal(SUPPORT_PLATFORMS[2]),
    ])
    .optional(),
  dev: z.boolean().optional(),
  minify: z.boolean().optional(),
  metafile: z.boolean().optional(),
  'entry-file': z.string().transform(resolvePath).optional(),
  'sourcemap-output': z.string().transform(resolvePath).optional(),
  'bundle-output': z.string().transform(resolvePath).optional(),
  'assets-dest': z.string().optional(),
});
