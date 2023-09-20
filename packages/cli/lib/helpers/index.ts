import path from 'node:path';
import readline from 'node:readline';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import type { BundleConfig } from '@react-native-esbuild/config';
import { logger } from '../shared';
import type { Argv, StartOptions, BuildOptions } from '../types';

export function getCommand<Argv extends { _: (string | number)[] }>(
  argv: Argv,
  position = 0,
): string {
  return argv._[position].toString();
}

export function resolvePath(filepath: string): string {
  return path.resolve(process.cwd(), filepath);
}

export function getOptions(argv: Argv): StartOptions | BuildOptions {
  const entryFilePath = argv.entry
    ? resolvePath(argv.entry as string)
    : undefined;
  const sourcemapPath = argv.sourcemap
    ? resolvePath(argv.sourcemap as string)
    : undefined;
  const outputFilePath = argv.output
    ? resolvePath(argv.output as string)
    : undefined;
  const assetsDir = typeof argv.assets === 'string' ? argv.assets : undefined;
  const platform = argv.platform as BundleConfig['platform'];
  const dev = Boolean(argv.dev ?? process.env.NODE_ENV === 'development');
  const minify = Boolean(argv.minify ?? !dev);
  const metafile = Boolean(argv.metafile ?? false);
  const verbose = typeof argv.verbose === 'boolean' ? argv.verbose : undefined;
  const timestamp = argv.timestamp;
  const resetCache =
    typeof argv.resetCache === 'boolean' ? argv.resetCache : undefined;

  const commonConfig = {
    verbose,
    resetCache,
    timestamp,
  };

  const bundleConfig: BundleConfig = {
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
