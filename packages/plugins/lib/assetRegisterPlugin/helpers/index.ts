import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import type { OnLoadArgs } from 'esbuild';
import { imageSize } from 'image-size';
import md5 from 'md5';
import type { BundlerSupportPlatform } from '@react-native-esbuild/config';
import {
  ASSET_PATH,
  SUPPORT_PLATFORMS,
  getDevServerAssetPath,
} from '@react-native-esbuild/config';
import type { PluginContext } from '@react-native-esbuild/core';
import { logger } from '../../shared';
import type { Asset, AssetScale, SuffixPathResult } from '../../types';

const PLATFORM_SUFFIX_PATTERN = SUPPORT_PLATFORMS.map(
  (platform) => `.${platform}`,
).join('|');

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

export function addSuffix(
  basename: string,
  extension: string,
  options?: {
    platform?: BundlerSupportPlatform | null;
    scale?: string | number;
  },
): string {
  return stripSuffix(basename, extension)
    .concat(options?.scale ? `@${options.scale}x` : '')
    .concat(options?.platform ? `.${options.platform}${extension}` : extension);
}

export function stripSuffix(basename: string, extension: string): string {
  return basename.replace(
    new RegExp(`(@(\\d+)x)?(${PLATFORM_SUFFIX_PATTERN})?${extension}`),
    '',
  );
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
  options?: {
    scale?: AssetScale;
    platform?: BundlerSupportPlatform | null;
  },
): SuffixPathResult {
  // if `scale` present, append scale suffix to path
  // assetPath: '/path/to/assets/image.png'
  // result:
  //   '/path/to/assets/image.png'
  //   '/path/to/assets/image.{platform}.png'
  //   '/path/to/assets/image@{scale}x.png'
  //   '/path/to/assets/image@{scale}x.{platform}.png'
  const extension = path.extname(assetPath);
  const dirname = path.dirname(assetPath);

  // strip exist suffixes and add new options based suffixes
  const strippedBasename = stripSuffix(path.basename(assetPath), extension);
  const suffixedBasename = addSuffix(strippedBasename, extension, options);

  return {
    dirname,
    basename: strippedBasename,
    extension,
    path: `${dirname}/${suffixedBasename}`,
    platform: options?.platform ?? null,
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
}: Pick<
  Asset,
  'name' | 'type' | 'scales' | 'hash' | 'httpServerLocation' | 'dimensions'
>): string {
  return `
    module.exports = require('react-native/Libraries/Image/AssetRegistry').registerAsset(${JSON.stringify(
      {
        __packager_asset: true,
        name,
        type,
        scales,
        hash,
        httpServerLocation,
        width: dimensions.width,
        height: dimensions.height,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- esbuild type
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

  const { basename, extension, platform } = args.pluginData;
  const relativePath = path.relative(context.root, args.path);
  const dirname = path.dirname(args.path);
  const filesInDir = await fs.readdir(dirname);
  const stripedBasename = stripSuffix(basename, extension);
  const assetRegExp = new RegExp(
    `${stripedBasename}(@(\\d+)x)?${
      platform ? `.${platform}${extension}` : extension
    }$`,
  );
  const scaledAssets: Partial<Record<AssetScale, string>> = {};

  for (const file of filesInDir) {
    const match = assetRegExp.exec(file);
    if (match) {
      const [, , scale = 1] = match;
      scaledAssets[scale] = file;
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
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare -- allow using default compare function
    scales: Object.keys(scaledAssets).map(parseFloat).sort(),
    httpServerLocation: path.join(ASSET_PATH, path.dirname(relativePath)),
    hash: md5(imageData),
    dimensions: {
      width: dimensions?.width ?? 0,
      height: dimensions?.height ?? 0,
    },
    platform,
  };
}

export async function resolveAssetPath(
  asset: Asset,
  targetScale: number,
): Promise<string> {
  const suffixedPath = getSuffixedPath(asset.path, {
    scale: targetScale as AssetScale,
    platform: asset.platform,
  }).path;

  // when scale is 1, filename can be `image.png` or `image@1x.png`
  // 1. check resolvedPath (image.png)
  // 2. if file is not exist, check suffixed path (image@1x.png)
  if (targetScale === 1) {
    const result = await fs
      .stat(asset.path)
      .then(() => asset.path)
      .catch(() => fs.stat(suffixedPath).then(() => suffixedPath));

    return result;
  }

  return suffixedPath;
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
  const { assetsDir, mode } = context;
  if (mode === 'watch') return;

  if (!assetsDir) {
    logger.warn('asset destination is not set');
    return;
  }

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
