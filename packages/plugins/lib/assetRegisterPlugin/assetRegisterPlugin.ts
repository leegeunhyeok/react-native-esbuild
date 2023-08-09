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
        const { svgr = false } = context.config.transform;
        const { assetExtensions = ASSET_EXTENSIONS } = config;
        const filteredAssetExtensions = assetExtensions.filter((extension) =>
          // if using svgr, ignore .svg file
          svgr ? extension !== '.svg' : true,
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

          // resolve original path (eg. `image.png`)
          let suffixedPathResult = getSuffixedPath(args.path);
          let resolveResult = await resolveAsset(suffixedPathResult, args);

          if (resolveResult.errors.length) {
            // if cannot resolve asset, try resolve with suffixed path (eg. `image@1x.png`)
            suffixedPathResult = getSuffixedPath(args.path, 1);
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
          await copyAssetsToDevServer(assets);
          await copyAssetsToDestination(context, assets);
        });
      },
    };
  };
};
