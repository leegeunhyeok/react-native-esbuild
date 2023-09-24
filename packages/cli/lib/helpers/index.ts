import path from 'node:path';
import readline from 'node:readline';
import { z } from 'zod';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { SUPPORT_PLATFORMS } from '@react-native-esbuild/config';
import { type BundleConfig } from '@react-native-esbuild/config';
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
  timestamp: z.boolean().optional(),
  port: z.number().optional(),
  host: z.string().optional(),
  'entry-file': z.string().optional(),
  'sourcemap-output': z.string().optional(),
  'bundle-output': z.string().optional(),
  'assets-dest': z.string().optional(),
  'reset-cache': z.boolean().optional(),
});

export function getCommand<RawArgv extends { _: (string | number)[] }>(
  argv: RawArgv,
  position = 0,
): string {
  return argv._[position].toString();
}

export function resolvePath(filepath: string): string {
  return path.resolve(process.cwd(), filepath);
}

export function getOptions(rawArgv: RawArgv): StartOptions | BuildOptions {
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
  const timestamp = argv.timestamp;
  const resetCache = argv['reset-cache'];

  const commonConfig = {
    verbose,
    resetCache,
    timestamp,
  };

  const bundleConfig: Partial<BundleConfig> = {
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
        ...commonConfig,
        port: argv.port,
        host: argv.host,
      } as StartOptions)
    : ({ ...commonConfig, bundleConfig } as BuildOptions);
}

export async function resetCache(): Promise<void> {
  await ReactNativeEsbuildBundler.caches.clearAll();
  logger.info('transform cache was reset');
}

export function enableInteractiveMode(
  onKeypress?: (keyName: string) => void,
): boolean {
  if (
    !(process.stdin.isTTY && typeof process.stdin.setRawMode === 'function')
  ) {
    logger.debug('interactive mode is not supported in this environment');
    return false;
  }

  /**
   * @see {@link https://nodejs.org/api/tty.html#readstreamsetrawmodemode}
   */
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');
  process.stdin.on(
    'keypress',
    (_data, key: { ctrl: boolean; name: string }) => {
      const { ctrl, name } = key;

      // shortcuts
      if (ctrl) {
        switch (name) {
          // Ctrl + C: SIGINT
          case 'c':
            process.exit(0);
            break;

          // Ctrl + Z: SIGTSTP
          case 'z':
            process.emit('SIGTSTP', 'SIGTSTP');
            break;
        }
        return;
      }

      onKeypress?.(name);
    },
  );

  return true;
}
