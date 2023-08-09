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

export function addSuffix(
  basename: string,
  extension: string,
  suffix: string | number,
): string {
  return basename.replace(
    new RegExp(`${extension}$`),
    `${suffix}.${extension}`,
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
  scale?: AssetScale,
): SuffixPathResult {
  // if `scale` present, append scale suffix to path
  // assetPath: '/path/to/assets/image.png'
  // result: '/path/to/assets/image@{scale}x.png'
  const extension = path.extname(assetPath);
  const dirname = path.dirname(assetPath);
  const basename = path.basename(assetPath);
  const suffixedBasename = scale
    ? addSuffix(basename, extension, `@${scale}x`)
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
  const assetRegExp = new RegExp(
    `${basename.replace(extension, '')}(@(\\d+)x)?${extension}$`,
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
    basename,
    name: basename.replace(extension, ''),
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

export async function copyAssetsToDevServer(assets: Asset[]): Promise<void> {
  const devServerAssetPath = getDevServerAssetPath();

  // cleanup asset cache directory
  await fs
    .rm(devServerAssetPath, { recursive: true, force: true })
    .catch(() => void 0);
  await fs.mkdir(devServerAssetPath, { recursive: true });

  const assetCopyTasks = assets.map(
    ({ path: resolvedPath, basename, extension, scales }) => {
      return scales.map(async (scale): Promise<void> => {
        let filepath: string;

        // when scale is 1, filename can be `image.png` or `image@1x.png`
        // 1. check resolvedPath (image.png)
        // 2. if file is not exist, check suffixed path (image@1x.png)
        if (scale === 1) {
          filepath = await fs
            .stat(resolvedPath)
            .then(() => resolvedPath)
            .catch(() => {
              const suffixedPath = resolvedPath.replace(
                basename,
                addSuffix(basename, extension, '@1x'),
              );
              return fs.stat(suffixedPath).then(() => suffixedPath);
            });
        } else {
          filepath = resolvedPath.replace(
            basename,
            addSuffix(basename, extension, `@${scale}x`),
          );
        }

        logger.debug(`copying ${basename}`);
        await fs.copyFile(
          filepath,
          path.join(devServerAssetPath, path.basename(filepath)),
        );
      });
    },
  );

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

  if (!assetsDir) return;

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
            const from = asset.path;
            const to = path.join(
              assetsDir,
              asset.httpServerLocation,
              asset.basename,
            );
            logger.debug('copy asset', { from, to });

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
            logger.debug('copy asset', { from, to });

            await mkdirWithAssertPath(to);
            await fs.copyFile(from, to);
          }

          const from = asset.path;
          const to = `${assetsDir}/${resourceDir}/${assetName}`;
          logger.debug('copy asset', { from, to });

          await mkdirWithAssertPath(to);
          await fs.copyFile(from, `${assetsDir}/${resourceDir}/${assetName}`);
        }),
      ).then(() => void 0);
    }),
  ).then(() => void 0);
}
