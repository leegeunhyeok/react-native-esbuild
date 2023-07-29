import fs from 'node:fs';
import path from 'node:path';

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

function resolveBundleDestination(destination: string): string {
  return path.resolve(process.cwd(), destination);
}

async function assertBundleDestinationPathIsValid(
  resolvedPath: string,
): Promise<void> {
  await fs.promises.access(path.dirname(resolvedPath), fs.constants.W_OK);
}
