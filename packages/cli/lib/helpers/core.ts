import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { logger } from '../shared';

export const resetCache = async (): Promise<void> => {
  await ReactNativeEsbuildBundler.caches.clearAll();
  logger.info('transform cache was reset');
};
