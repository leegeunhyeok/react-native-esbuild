import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import type { OnLoadArgs } from 'esbuild';
import { imageSize } from 'image-size';
import md5 from 'md5';
import {
  ASSET_PATH,
  getDevServerAssetPath,
} from '@react-native-esbuild/config';
import type { PluginContext } from '@react-native-esbuild/core';
import { logger } from '../../shared';
import type { Asset, AssetScale, SuffixPathResult } from '../../types';

const imageSizeOf = promisify(imageSize);

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

export function addScaleSuffix(
  basename: string,
  extension: string,
  suffix: string | number,
): string {
  return basename
    .replace(new RegExp(`(@(\\d+)x)?${extension}$`), '')
    .concat(`@${suffix}x${extension}`);
}

/**
 * add scale suffix to asset path
 *
 * ```js
 * // assetPath input
 * '/path/to/assets/image.png'
 *
 * // suffixed by `scale`
 * '/path/to/assets/image@1x.png'
 * '/path/to/assets/image@2x.png'
 * '/path/to/assets/image@3x.png'
 * ```
 */
export function getSuffixedPath(
  assetPath: string,
  scale?: AssetScale,
): SuffixPathResult {
  // if `scale` present, append scale suffix to path
  // assetPath: '/path/to/assets/image.png'
  // result: '/path/to/assets/image@{scale}x.png'
  const extension = path.extname(assetPath);
  const dirname = path.dirname(assetPath);
  const basename = path.basename(assetPath);
  const suffixedBasename = scale
    ? addScaleSuffix(basename, extension, scale)
    : basename;

  return {
    dirname,
    basename: suffixedBasename,
    extension,
    path: `${dirname}/${suffixedBasename}`,
  };
}

/**
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/Bundler/util.js#L29-L57}
 * @see {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/Image/RelativeImageStub.js}
 */
export function getAssetRegistrationScript({
  name,
  type,
  scales,
  hash,
  httpServerLocation,
  dimensions,
}: Asset): string {
  return `
    module.exports = require('react-native/Libraries/Image/AssetRegistry').registerAsset(${JSON.stringify(
      {
        __packager_asset: true,
        name,
        type,
        scales,
        hash,
        httpServerLocation,
        height: dimensions.height,
        width: dimensions.width,
      },
    )});
  `;
}

function getBasePath(asset: Asset): string {
  const basePath = asset.httpServerLocation;
  return basePath.at(0) === '/' ? basePath.substring(1) : basePath;
}

function assertSuffixPathResult(
  data: OnLoadArgs['pluginData'],
): asserts data is SuffixPathResult {
  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    !(typeof data.basename === 'string' && typeof data.extension === 'string')
  ) {
    throw new Error('invalid pluginData');
  }
}

export async function resolveScaledAssets(
  context: PluginContext,
  args: OnLoadArgs,
): Promise<Asset> {
  assertSuffixPathResult(args.pluginData);

  const { basename, extension } = args.pluginData;
  const relativePath = path.relative(context.root, args.path);
  const dirname = path.dirname(args.path);
  const filesInDir = await fs.readdir(dirname);
  const stripedBasename = basename.replace(
    new RegExp(`(@(\\d+)x)?${extension}$`),
    '',
  );
  const assetRegExp = new RegExp(
    // strip exist scale suffix
    `${stripedBasename}(@(\\d+)x)?${extension}$`,
  );
  const scaledAssets: Partial<Record<AssetScale, string>> = {};

  for (const file of filesInDir) {
    const match = assetRegExp.exec(file);
    if (match) {
      const [, , scale] = match;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      scaledAssets[scale ?? 1] = file;
    }
  }

  if (!(Object.keys(scaledAssets).length && scaledAssets[1])) {
    throw new Error(`cannot resolve base asset of ${args.path}`);
  }

  const dimensions = await imageSizeOf(args.path);
  const imageData = await fs.readFile(args.path);

  return {
    path: args.path,
    basename: stripedBasename,
    name: stripedBasename.replace(extension, ''),
    extension,
    type: extension.substring(1),
    scales: Object.keys(scaledAssets).map(parseFloat).sort(),
    httpServerLocation: path.join(ASSET_PATH, path.dirname(relativePath)),
    hash: md5(imageData),
    dimensions: {
      width: dimensions?.width ?? 0,
      height: dimensions?.height ?? 0,
    },
  };
}

export async function resolveAssetPath(
  asset: Asset,
  targetScale: number,
): Promise<string> {
  const basename = path.basename(asset.path);
  // when scale is 1, filename can be `image.png` or `image@1x.png`
  // 1. check resolvedPath (image.png)
  // 2. if file is not exist, check suffixed path (image@1x.png)
  if (targetScale === 1) {
    // eslint-disable-next-line no-return-await
    return await fs
      .stat(asset.path)
      .then(() => asset.path)
      .catch(() => {
        const suffixedPath = asset.path.replace(
          basename,
          addScaleSuffix(basename, asset.extension, targetScale),
        );
        return fs.stat(suffixedPath).then(() => suffixedPath);
      });
  }

  return asset.path.replace(
    basename,
    addScaleSuffix(basename, asset.extension, targetScale),
  );
}

export async function copyAssetsToDevServer(
  context: PluginContext,
  assets: Asset[],
): Promise<void> {
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
}

/**
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/assetPathUtils.ts}
 */
export async function copyAssetsToDestination(
  context: PluginContext,
  assets: Asset[],
): Promise<void> {
  const { assetsDir } = context;

  if (!assetsDir || context.mode === 'watch') return;

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

            logger.debug('copying asset', { from, to });

            await mkdirWithAssertPath(to);
            return fs.copyFile(from, to);
          }

          let resourceDir = 'raw';
          const assetQualifierSuffix: string = ANDROID_ASSET_QUALIFIER[scale];
          const assetDir = getBasePath(asset);
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
            logger.debug('copying asset', { from, to });

            await mkdirWithAssertPath(to);
            await fs.copyFile(from, to);
          }

          const from = await resolveAssetPath(asset, scale);
          const to = `${assetsDir}/${resourceDir}/${assetName}`;
          logger.debug('copying asset', { from, to });

          await mkdirWithAssertPath(to);
          await fs.copyFile(from, to);
        }),
      ).then(() => void 0);
    }),
  ).then(() => void 0);
}
