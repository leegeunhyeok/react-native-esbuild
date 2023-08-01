import fs from 'node:fs';
import path from 'node:path';
import { ASSET_PATH } from '@react-native-esbuild/config';
import type { OnResolveArgs, ResolveResult } from 'esbuild';
import type {
  AssetRegisterPluginConfig,
  AssetScale,
  PluginCreator,
  RegistrationScriptParams,
  SuffixPathResult,
} from '../types';

const ASSET_NAMESPACE = 'react-native-esbuild-assets';

/**
 * @see {@link https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp}
 */
// const ANDROID_ASSET_QUALIFIER = {
//   0.75: 'ldpi',
//   1: 'mdpi',
//   1.5: 'hdpi',
//   2: 'xhdpi',
//   3: 'xxhdpi',
//   4: 'xxxhdpi',
// } as const;

/**
 * @see {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/Image/RelativeImageStub.js}
 */
const getRegistrationScript = (
  params: RegistrationScriptParams,
  isDev: boolean,
): string => `
  module.exports = require('@react-native/assets-registry/registry.js').registerAsset(${JSON.stringify(
    {
      __packager_asset: true,
      name: params.basename.replace(params.extension, ''),
      type: params.extension.substring(1), // remove dot
      scales: params.scales.sort(),
      hash: params.hash,
      httpServerLocation: params.httpServerLocation,
      fileSystemLocation: isDev ? path.dirname(params.relativePath) : undefined,
      height: params.dimensions.height,
      width: params.dimensions.width,
    },
  )});
`;

export const createAssetRegisterPlugin: PluginCreator<
  AssetRegisterPluginConfig
> = (config) => ({
  name: 'asset-register-plugin',
  setup: (build): void => {
    const { assetExtensions } = config;
    const assetExtensionsFilter = new RegExp(
      `.(${assetExtensions.join('|')})$`,
    );

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
    const getSuffixedPath = (
      assetPath: string,
      scale?: AssetScale,
    ): SuffixPathResult => {
      // if `scale` present, append scale suffix to path
      // assetPath: '/path/to/assets/image.png'
      // result: '/path/to/assets/image@{scale}x.png'
      const extension = path.extname(assetPath);
      const dirname = path.dirname(assetPath);
      const basename = path.basename(assetPath);
      const suffixedBasename = scale
        ? basename.replace(
            new RegExp(`${extension}$`),
            `@${scale}x.${extension}`,
          )
        : basename;

      return {
        dirname,
        basename: suffixedBasename,
        extension,
        path: scale ? path.join(dirname, suffixedBasename) : assetPath,
      };
    };

    const resolveAsset = (
      result: SuffixPathResult,
      { importer, kind, namespace, resolveDir }: OnResolveArgs,
    ): Promise<ResolveResult> => {
      return build.resolve(result.path, {
        resolveDir,
        importer,
        kind,
        namespace,
        pluginData: result,
      });
    };

    build.onResolve({ filter: assetExtensionsFilter }, async (args) => {
      if (args.pluginData) return null;

      // resolve original path (eg. `image.png`)
      // if cannot resolve asset, try resolve with suffixed path (eg. `image@1x.png`)
      let suffixedPathResult = getSuffixedPath(args.path);
      const resolveResult = await resolveAsset(suffixedPathResult, args).catch(
        () =>
          resolveAsset(
            (suffixedPathResult = getSuffixedPath(args.path, 1)),
            args,
          ),
      );

      if (resolveResult.errors.length) {
        return { errors: resolveResult.errors };
      }

      return {
        path: resolveResult.path,
        namespace: ASSET_NAMESPACE,
        pluginData: suffixedPathResult,
      };
    });

    build.onLoad({ filter: /./, namespace: ASSET_NAMESPACE }, async (args) => {
      const { basename, extension } = args.pluginData as SuffixPathResult;
      const dirname = path.dirname(args.path);
      const relativePath = path.relative(
        build.initialOptions.sourceRoot ?? process.cwd(),
        args.path,
      );

      const filesInDir = await fs.promises.readdir(dirname);
      const assetRegExp = new RegExp(
        `${basename.replace(extension, '')}(@(\\d+)x)?${extension}$`,
      );
      const scaledAssets: Partial<Record<AssetScale, string>> = {};

      for (const file of filesInDir) {
        const match = assetRegExp.exec(file);
        if (match) {
          const [, , scale] = match;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          scaledAssets[scale ?? '1'] = file;
        }
      }

      if (!(Object.keys(scaledAssets).length && scaledAssets[1])) {
        throw new Error(`cannot resolve base asset of ${args.path}`);
      }

      return {
        resolveDir: dirname,
        contents: getRegistrationScript(
          {
            basename,
            extension,
            relativePath,
            scales: Object.keys(scaledAssets).map(parseFloat).sort(),
            hash: '',
            httpServerLocation: path.join(
              ASSET_PATH,
              path.dirname(relativePath),
            ),
            dimensions: { width: 0, height: 0 },
          },
          true,
        ),
        loader: 'js',
      };
    });
  },
});
