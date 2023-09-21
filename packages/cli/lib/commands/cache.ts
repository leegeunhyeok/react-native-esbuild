import { resetCache } from '../helpers';
import type { Command } from '../types';

export const cache: Command = async (_options, subCommand) => {
  if (subCommand === 'clean') {
    await resetCache();
  }
};
