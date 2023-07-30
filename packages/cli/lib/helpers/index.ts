import fs from 'node:fs';
import path from 'node:path';
import type { Argv, StartOptions, BuildOptions } from '../types';

export function getCommand<Argv extends { _: (string | number)[] }>(
  argv: Argv,
): string {
  return argv._[0].toString();
}

export async function assertCommandOptions(
  _command: string,
  options: Record<string, unknown>,
): Promise<boolean> {
  try {
    const resolvedPath = resolvePath(options.output as string);
    await assertBundleDestinationPathIsValid(resolvedPath);
    return true;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export function resolvePath(destination: string): string {
  return path.resolve(process.cwd(), destination);
}

async function assertBundleDestinationPathIsValid(
  resolvedPath: string,
): Promise<void> {
  await fs.promises.access(path.dirname(resolvedPath), fs.constants.W_OK);
}

export function getOptions(argv: Argv): StartOptions | BuildOptions {
  const entryFilePath = resolvePath(argv.entry as string);
  const outputFilePath = resolvePath(argv.output as string);
  const assetsDestination = path.dirname(entryFilePath);
  const dev = argv.dev ?? process.env.NODE_ENV === 'development';
  const minify = argv.minify ?? dev;

  if (typeof argv.port === 'number') {
    return {
      entryFile: entryFilePath,
      outputFile: outputFilePath,
      assetsDest: assetsDestination,
      dev,
      minify,
      port: argv.port,
      host: argv.host,
    } as StartOptions;
  } else if (typeof argv.destination === 'string') {
    return {
      entryFile: entryFilePath,
      outputFile: outputFilePath,
      platform: assetsDestination,
      dev,
      minify,
    } as BuildOptions;
  }
  throw new Error('invalid options');
}
