import path from 'node:path';
import { z } from 'zod';
import {
  SUPPORT_PLATFORMS,
  type BundleOptions,
} from '@react-native-esbuild/config';
import { colors } from '@react-native-esbuild/utils';
import { logger } from '../shared';
import type { RawArgv, StartOptions, BuildOptions } from '../types';

const cliArgvSchema = z.object({
  /**
   * type infer issue with using map
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
  verbose: z.boolean().optional(),
  port: z.number().optional(),
  host: z.string().optional(),
  'entry-file': z.string().optional(),
  'sourcemap-output': z.string().optional(),
  'bundle-output': z.string().optional(),
  'assets-dest': z.string().optional(),
  'reset-cache': z.boolean().optional(),
});

export const getCommand = <RawArgv extends { _: (string | number)[] }>(
  argv: RawArgv,
  position = 0,
): string => argv._[position].toString();

const resolvePath = (filepath: string): string =>
  path.resolve(process.cwd(), filepath);

export const getOptions = (rawArgv: RawArgv): StartOptions | BuildOptions => {
  const argv = cliArgvSchema.parse(rawArgv);
  const entryFilePath = argv['entry-file']
    ? resolvePath(argv['entry-file'])
    : undefined;
  const sourcemapPath = argv['sourcemap-output']
    ? resolvePath(argv['sourcemap-output'])
    : undefined;
  const outputFilePath = argv['bundle-output']
    ? resolvePath(argv['bundle-output'])
    : undefined;
  const assetsDir = argv['assets-dest'];
  const platform = argv.platform;
  const dev = argv.dev ?? process.env.NODE_ENV === 'development';
  const minify = argv.minify;
  const metafile = argv.metafile;
  const verbose = argv.verbose;
  const resetCache = argv['reset-cache'];

  const commonOptions = {
    verbose,
    resetCache,
  };

  const bundleOptions: Partial<BundleOptions> = {
    entry: entryFilePath,
    sourcemap: sourcemapPath,
    outfile: outputFilePath,
    assetsDir,
    platform,
    dev,
    minify,
    metafile,
  };

  return typeof argv.port === 'number'
    ? ({
        ...commonOptions,
        port: argv.port,
        host: argv.host,
      } as StartOptions)
    : ({ ...commonOptions, bundleOptions } as BuildOptions);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
export const printDebugOptions = <T extends Record<string, any>>(
  options: T,
): void => {
  Object.entries(options).forEach(([key, value], index, entries) => {
    const isLast = entries.length - 1 === index;
    const pipe = `${isLast ? '╰' : '├'}─`;
    const keyValue = `${key}: ${JSON.stringify(value)}`;
    logger.debug(colors.gray(`${pipe} ${keyValue}${isLast ? '\n' : ''}`));
  });
};
