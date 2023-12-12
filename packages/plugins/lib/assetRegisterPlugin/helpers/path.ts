import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import type { OnLoadArgs } from 'esbuild';
import { imageSize } from 'image-size';
import md5 from 'md5';
import invariant from 'invariant';
import {
  ASSET_PATH,
  SUPPORT_PLATFORMS,
  type BuildContext,
  type SupportedPlatform,
} from '@react-native-esbuild/shared';
import type { Asset, AssetScale } from '@react-native-esbuild/internal';
import type { SuffixPathResult } from '../../types';

const PLATFORM_SUFFIX_PATTERN = SUPPORT_PLATFORMS.map(
  (platform) => `.${platform}`,
).join('|');

const SCALE_PATTERN = '@(\\d+\\.?\\d*)x';
const ALLOW_SCALES: Partial<Record<SupportedPlatform, number[]>> = {
  ios: [1, 2, 3],
};

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

const imageSizeOf = promisify(imageSize);

export const getAssetPriority = (filename: string): number => {
  if (
    new RegExp(`${SCALE_PATTERN}(?:${PLATFORM_SUFFIX_PATTERN})`).test(filename)
  ) {
    return 3;
  } else if (new RegExp(`(?:${PLATFORM_SUFFIX_PATTERN})`).test(filename)) {
    return 2;
  } else if (new RegExp(`${SCALE_PATTERN}`).test(filename)) {
    return 1;
  }
  return 0;
};

export const addSuffix = (
  basename: string,
  extension: string,
  options?: {
    platform?: string | null;
    scale?: string | number;
  },
): string => {
  return stripSuffix(basename, extension)
    .concat(options?.scale ? `@${options.scale}x` : '')
    .concat(options?.platform ? `.${options.platform}${extension}` : extension);
};

export const stripSuffix = (basename: string, extension: string): string => {
  return basename.replace(
    new RegExp(
      `(${SCALE_PATTERN})?(?:${PLATFORM_SUFFIX_PATTERN})?${extension}`,
    ),
    '',
  );
};

/**
 * add suffix to asset path
 *
 * ```js
 * // assetPath input
 * '/path/to/assets/image.png'
 *
 * // `platform` suffixed
 * '/path/to/assets/image.android.png'
 *
 * // `scale` suffixed
 * '/path/to/assets/image@1x.png'
 *
 * // both `platform` and `scale` suffixed
 * '/path/to/assets/image@1x.android.png'
 * ```
 */
export const getSuffixedPath = (
  assetPath: string,
  options?: {
    scale?: AssetScale;
    platform?: string | null;
  },
): SuffixPathResult => {
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
};

export const getDevServerBasePath = (asset: Asset): string => {
  const basePath = asset.httpServerLocation;
  return basePath.at(0) === '/' ? basePath.substring(1) : basePath;
};

function assertSuffixPathResult(
  data: OnLoadArgs['pluginData'],
): asserts data is SuffixPathResult {
  invariant(data.basename, 'basename is empty');

  invariant(data.extension, 'extension is empty');
}

export const resolveScaledAssets = async (
  context: BuildContext,
  args: OnLoadArgs,
): Promise<Asset> => {
  assertSuffixPathResult(args.pluginData);

  const { basename, extension, platform } = args.pluginData;
  const relativePath = path.relative(context.root, args.path);
  const dirname = path.dirname(args.path);
  const filesInDir = await fs.readdir(dirname);
  const stripedBasename = stripSuffix(basename, extension);
  const assetRegExp = new RegExp(
    `${stripedBasename}(${SCALE_PATTERN})?(?:${PLATFORM_SUFFIX_PATTERN})?${extension}$`,
  );
  const scaledAssets: Partial<Record<AssetScale, string>> = {};

  for (const file of filesInDir.sort(
    (a, b) => getAssetPriority(b) - getAssetPriority(a),
  )) {
    const match = assetRegExp.exec(file);
    if (match) {
      const [, , scale = '1'] = match;
      if (scaledAssets[scale]) continue;
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
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare -- Allow sort's default compare function.
    scales: Object.keys(scaledAssets)
      .map(parseFloat)
      .filter((scale: number) => {
        // https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/filterPlatformAssetScales.ts
        return (
          ALLOW_SCALES[context.bundleOptions.platform]?.includes(scale) ?? true
        );
      })
      .sort(),
    httpServerLocation: path.join(ASSET_PATH, path.dirname(relativePath)),
    hash: md5(imageData),
    dimensions: {
      width: dimensions?.width ?? 0,
      height: dimensions?.height ?? 0,
    },
    platform,
  };
};

export const resolveAssetPath = async (
  asset: Asset,
  targetScale: number,
): Promise<string> => {
  const suffixedPath = getSuffixedPath(asset.path, {
    scale: targetScale as AssetScale,
    platform: asset.platform,
  }).path;

  /**
   * When scale is 1, filename can be suffixed or non-suffixed(`image.png`).
   *
   * - Suffixed
   *   - `filename.<platform>@<scale>x.ext`
   *   - `filename.<platform>.ext`
   *   - `filename@<scale>x.ext`
   * - Non suffixed
   *   - `filename.ext`
   *
   * 1. Resolve non-suffixed asset first.
   * 2. If file is not exist, resolve suffixed path.
   */
  if (targetScale === 1) {
    const result = await fs
      .stat(asset.path)
      .then(() => asset.path)
      .catch(() => fs.stat(suffixedPath).then(() => suffixedPath));

    return result;
  }

  return suffixedPath;
};

/**
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/getAssetDestPathAndroid.ts}
 */
export const getAndroidAssetDestinationPath = (
  asset: Asset,
  scale: number,
): string => {
  let resourceDir = 'raw';
  const assetQualifierSuffix: string = ANDROID_ASSET_QUALIFIER[scale];
  const assetDir = getDevServerBasePath(asset);
  const assetName = `${assetDir}/${asset.name}`
    .toLowerCase()
    .replace(/\//g, '_')
    .replace(/(?:[^a-z0-9_])/g, '')
    .replace(/^assets_/, '');

  if (!assetQualifierSuffix) {
    throw new Error(`invalid asset qualifier: ${asset.path}`);
  }

  /**
   * @see {@link https://developer.android.com/guide/topics/resources/drawable-resource}
   */
  const isDrawable = /\.(?:png|jpg|jpeg|gif|xml)$/.test(asset.extension);
  if (isDrawable) {
    resourceDir = `drawable-${assetQualifierSuffix}`;
  }

  return path.join(resourceDir, `${assetName}.${asset.type}`);
};

/**
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.6/packages/cli-plugin-metro/src/commands/bundle/getAssetDestPathIOS.ts}
 */
export const getAssetDestinationPath = (
  asset: Asset,
  scale: number,
): string => {
  const suffix = scale === 1 ? '' : `@${scale}x`;
  const fileName = `${asset.name + suffix}.${asset.type}`;
  return path.join(
    getDevServerBasePath(asset).replace(/\.\.\//g, '_'),
    fileName,
  );
};
