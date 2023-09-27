import fs from 'node:fs/promises';
import path from 'node:path';
import { getDevServerAssetPath } from '@react-native-esbuild/config';
import type { PluginContext } from '@react-native-esbuild/core';
import type { Asset } from '@react-native-esbuild/internal';
import { logger } from '../../shared';
import { getDevServerBasePath, resolveAssetPath } from './path';

/**
 * @see {@link https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp}
 */
const ANDROID_ASSET_QUALIFIER: Record<number, string> = {
  0.75: 'ldpi',
  1: 'mdpi',
  1.5: 'hdpi',
  2: 'xhdpi',
  3: 'xxhdpi',
  4: 'xxxhdpi',
} as const;

/**
 * copy assets to dev server asset directory
 */
export const copyAssetsToDevServer = async (
  context: PluginContext,
  assets: Asset[],
): Promise<void> => {
  if (context.mode === 'bundle') return;

  const devServerAssetPath = getDevServerAssetPath();

  // cleanup asset cache directory
  await fs
    .rm(devServerAssetPath, { recursive: true, force: true })
    .catch(() => void 0);
  await fs.mkdir(devServerAssetPath, { recursive: true });

  const assetCopyTasks = assets.map((asset) => {
    return asset.scales.map(async (scale): Promise<void> => {
      const filepath = await resolveAssetPath(asset, scale);
      await fs.copyFile(
        filepath,
        path.join(devServerAssetPath, path.basename(filepath)),
      );
    });
  });

  await Promise.all(assetCopyTasks);
};

/**
 * copy assets to platform specified destination
 *
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/assetPathUtils.ts}
 */
export const copyAssetsToDestination = async (
  context: PluginContext,
  assets: Asset[],
): Promise<void> => {
  const { assetsDir, mode } = context;
  if (mode === 'watch') return;

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
          if (context.platform !== 'android') {
            const from = await resolveAssetPath(asset, scale);
            const to = path.join(
              assetsDir,
              asset.httpServerLocation,
              path.basename(from),
            );

            await mkdirWithAssertPath(to);
            return fs.copyFile(from, to);
          }

          let resourceDir = 'raw';
          const assetQualifierSuffix: string = ANDROID_ASSET_QUALIFIER[scale];
          const assetDir = getDevServerBasePath(asset);
          const assetName = `${assetDir}/${asset.name}`
            .toLowerCase()
            .replace(/\//g, '_')
            .replace(/(?:[^a-z0-9_])/g, '')
            .replace(/^assets_/, '')
            .concat(asset.extension);

          if (!assetQualifierSuffix) {
            throw new Error(`invalid asset qualifier: ${asset.path}`);
          }

          /**
           * @see {@link https://developer.android.com/guide/topics/resources/drawable-resource}
           */
          const isDrawable = /\.(?:png|jpg|jpeg|gif|xml)$/.test(
            asset.extension,
          );
          if (isDrawable) {
            resourceDir = `drawable-${assetQualifierSuffix}`;
          }

          if (isDrawable && scale === 1) {
            const from = asset.path;
            const to = `${assetsDir}/drawable/${assetName}`;

            await mkdirWithAssertPath(to);
            await fs.copyFile(from, to);
          }

          const from = await resolveAssetPath(asset, scale);
          const to = `${assetsDir}/${resourceDir}/${assetName}`;

          await mkdirWithAssertPath(to);
          await fs.copyFile(from, to);
        }),
      ).then(() => void 0);
    }),
  ).then(() => void 0);
};
