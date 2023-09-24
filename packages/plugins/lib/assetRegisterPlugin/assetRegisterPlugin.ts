import path from 'node:path';
import type { OnResolveArgs, ResolveResult } from 'esbuild';
import type { EsbuildPluginFactory } from '@react-native-esbuild/core';
import { ASSET_EXTENSIONS } from '@react-native-esbuild/config';
import type {
  Asset,
  AssetRegisterPluginConfig,
  SuffixPathResult,
} from '../types';
import {
  copyAssetsToDestination,
  copyAssetsToDevServer,
  getAssetRegistrationScript,
  getSuffixedPath,
  resolveScaledAssets,
} from './helpers';

const NAME = 'asset-register-plugin';
const ASSET_NAMESPACE = 'react-native-esbuild-assets';
const DEFAULT_PLUGIN_CONFIG = { assetExtensions: ASSET_EXTENSIONS } as const;

export const createAssetRegisterPlugin: EsbuildPluginFactory<
  AssetRegisterPluginConfig
> = (config = DEFAULT_PLUGIN_CONFIG) => {
  return function assetRegisterPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const { convertSvg = false } = context.config.transformer ?? {};
        const { assetExtensions = ASSET_EXTENSIONS } = config;
        const filteredAssetExtensions = assetExtensions.filter((extension) =>
          // if using svgr, ignore svg assets for file loader
          convertSvg ? extension !== '.svg' : true,
        );
        const assetExtensionsFilter = new RegExp(
          `.(${filteredAssetExtensions.join('|')})$`,
        );
        let assets: Asset[] = [];

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

        build.onStart(() => {
          assets = [];
        });

        build.onResolve({ filter: assetExtensionsFilter }, async (args) => {
          if (args.pluginData) return null;

          /**
           * Resolve assets flow
           *
           * 1. Resolve platform and scale suffixed asset (eg. `image@1x.ios.png`)
           * 2. Resolve platform scale suffixed asset (eg. `image.ios.png`)
           * 3. Resolve scale suffixed asset (eg. `image@1x.png`)
           * 4. Resolve original asset (eg. `image.png`)
           */

          // 1
          let suffixedPathResult = getSuffixedPath(args.path, {
            scale: 1,
            platform: context.platform,
          });
          let resolveResult = await resolveAsset(suffixedPathResult, args);

          // 2
          if (resolveResult.errors.length) {
            suffixedPathResult = getSuffixedPath(args.path, {
              platform: context.platform,
            });
            resolveResult = await resolveAsset(suffixedPathResult, args);
          }

          // 3
          if (resolveResult.errors.length) {
            suffixedPathResult = getSuffixedPath(args.path, { scale: 1 });
            resolveResult = await resolveAsset(suffixedPathResult, args);
          }

          // 4
          if (resolveResult.errors.length) {
            suffixedPathResult = getSuffixedPath(args.path);
            resolveResult = await resolveAsset(suffixedPathResult, args);
          }

          if (resolveResult.errors.length) {
            return { errors: resolveResult.errors };
          }

          return {
            path: resolveResult.path,
            namespace: ASSET_NAMESPACE,
            pluginData: suffixedPathResult,
          };
        });

        build.onLoad(
          { filter: /./, namespace: ASSET_NAMESPACE },
          async (args) => {
            const asset = await resolveScaledAssets(context, args);

            assets.push(asset);

            return {
              resolveDir: path.dirname(args.path),
              contents: getAssetRegistrationScript(asset),
              loader: 'js',
            };
          },
        );

        build.onEnd(async () => {
          await copyAssetsToDevServer(context, assets);
          await copyAssetsToDestination(context, assets);
        });
      },
    };
  };
};
