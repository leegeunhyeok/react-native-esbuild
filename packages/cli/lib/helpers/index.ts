import fs from 'node:fs';
import path from 'node:path';
import type { StartOptions, BuildOptions } from '../types';

export function getCommand<Argv extends { _: (string | number)[] }>(
  argv: Argv,
): string {
  return argv._[0].toString();
}

export async function assertCommandOptions(
  command: string,
  options: Record<string, unknown>,
): Promise<boolean> {
  try {
    if (command === 'build') {
      const resolvedPath = resolveBundleDestination(
        options.destination as string,
      );
      await assertBundleDestinationPathIsValid(resolvedPath);
    }

    return true;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export function resolveBundleDestination(destination: string): string {
  return path.resolve(process.cwd(), destination);
}

async function assertBundleDestinationPathIsValid(
  resolvedPath: string,
): Promise<void> {
  await fs.promises.access(path.dirname(resolvedPath), fs.constants.W_OK);
}

export function getOptions(
  argv: Record<string, unknown>,
): StartOptions | BuildOptions {
  if (typeof argv.port === 'number') {
    return {
      port: argv.port,
      dev: argv.dev,
      minify: argv.minify,
    } as StartOptions;
  } else if (typeof argv.destination === 'string') {
    return {
      destination: argv.destination,
      dev: argv.dev,
      minify: argv.minify,
      platform: argv.platform,
    } as BuildOptions;
  }
  throw new Error('invalid options');
}
