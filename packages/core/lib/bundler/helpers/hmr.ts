import {
  getModuleCodeFromBundle,
  isReactRefreshRegistered,
} from '@react-native-esbuild/hmr';
import type { UpdatedModule } from '../../types';

export const getHmrUpdatedModule = (
  id: string | null,
  path: string | null,
  bundleCode: string,
): UpdatedModule | null => {
  const updatedCode =
    id && path ? getModuleCodeFromBundle(bundleCode, id) : null;

  return updatedCode
    ? {
        code: updatedCode,
        id: id ?? '',
        path: path ?? '',
        mode: isReactRefreshRegistered(updatedCode)
          ? 'hot-reload'
          : 'full-reload',
      }
    : null;
};
