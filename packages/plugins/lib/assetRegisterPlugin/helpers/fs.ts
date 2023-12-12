import fs from 'node:fs/promises';
import path from 'node:path';
import { BuildMode, type BuildContext } from '@react-native-esbuild/shared';
import type { Asset } from '@react-native-esbuild/internal';
import { logger } from '../../shared';
import {
  getAndroidAssetDestinationPath,
  getAssetDestinationPath,
  resolveAssetPath,
} from './path';

/**
 * Copy assets to platform specified destination.
 *
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/assetPathUtils.ts}
 */
export const copyAssetsToDestination = async (
  context: BuildContext,
  assets: Asset[],
): Promise<void> => {
  const { mode } = context;
  const { platform, assetsDir } = context.bundleOptions;

  if (mode === BuildMode.Watch) return;

  if (!assetsDir) {
    logger.warn('asset destination is not set');
    return;
  }

  logger.debug('copy assets to target destination');

  const mkdirWithAssertPath = (targetPath: string): Promise<void> => {
    const dirname = path.dirname(targetPath);
    return fs
      .access(dirname)
      .catch(() => fs.mkdir(dirname, { recursive: true }))
      .then(() => void 0);
  };

  return Promise.all(
    assets.map((asset): Promise<void> => {
      return Promise.all(
        asset.scales.map(async (scale): Promise<void> => {
          if (platform !== 'android') {
            const from = await resolveAssetPath(asset, scale);
            const to = path.join(
              assetsDir,
              getAssetDestinationPath(asset, scale),
            );
            await mkdirWithAssertPath(to);
            return fs.copyFile(from, to);
          }

          const from = await resolveAssetPath(asset, scale);
          const to = path.join(
            assetsDir,
            getAndroidAssetDestinationPath(asset, scale),
          );
          await mkdirWithAssertPath(to);
          await fs.copyFile(from, to);
        }),
      ).then(() => void 0);
    }),
  ).then(() => void 0);
};
