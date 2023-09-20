import { resetCache } from '../helpers';

export async function cache(subCommand: string): Promise<void> {
  if (subCommand === 'clean') {
    await resetCache();
  }
}
