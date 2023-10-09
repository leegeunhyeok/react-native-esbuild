import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import type { Command } from '../types';

export const cache: Command = async (_argv, subCommand) => {
  if (subCommand === 'clean') {
    await ReactNativeEsbuildBundler.resetCache();
  }
};
