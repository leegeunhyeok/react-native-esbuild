import fs from 'node:fs';
import path from 'node:path';
import type { BundleConfig } from '@react-native-esbuild/config';
import type { Argv, StartOptions, BuildOptions } from '../types';

export function getCommand<Argv extends { _: (string | number)[] }>(
  argv: Argv,
  position = 0,
): string {
  return argv._[position].toString();
}

export async function assertCommandOptions(
  command: string,
  options: Record<string, unknown>,
): Promise<boolean> {
  try {
    if (command !== 'build') return true;
    const resolvedPath = resolvePath(options.output as string);
    await assertBundleDestinationPathIsValid(resolvedPath);
    return true;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export function resolvePath(filepath: string): string {
  return path.resolve(process.cwd(), filepath);
}

async function assertBundleDestinationPathIsValid(
  resolvedPath: string,
): Promise<void> {
  await fs.promises.access(path.dirname(resolvedPath), fs.constants.W_OK);
}

export function getOptions(argv: Argv): StartOptions | BuildOptions {
  const entryFilePath = argv.entry
    ? resolvePath(argv.entry as string)
    : undefined;
  const outputFilePath = argv.output
    ? resolvePath(argv.output as string)
    : undefined;
  const assetsDir = typeof argv.assets === 'string' ? argv.assets : undefined;
  const platform = argv.platform as BundleConfig['platform'];
  const dev = Boolean(argv.dev ?? process.env.NODE_ENV === 'development');
  const minify = Boolean(argv.minify ?? dev);
  const debug = typeof argv.debug === 'boolean' ? argv.debug : undefined;
  const resetCache =
    typeof argv.resetCache === 'boolean' ? argv.resetCache : undefined;

  const bundleConfig: BundleConfig = {
    entry: entryFilePath,
    outfile: outputFilePath,
    assetsDir,
    platform,
    dev,
    minify,
  };

  return typeof argv.port === 'number'
    ? ({
        debug,
        resetCache,
        port: argv.port,
        host: argv.host,
      } as StartOptions)
    : ({ bundleConfig, debug, resetCache } as BuildOptions);
}
