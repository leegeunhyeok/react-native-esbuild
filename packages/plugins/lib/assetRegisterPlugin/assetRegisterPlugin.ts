import path from 'node:path';
import type { OnResolveArgs, ResolveResult } from 'esbuild';
import type { ReactNativeEsbuildPluginCreator } from '@react-native-esbuild/core';
import {
  getAssetRegistrationScript,
  type Asset,
} from '@react-native-esbuild/internal';
import { ASSET_EXTENSIONS } from '@react-native-esbuild/internal';
import type { AssetRegisterPluginConfig, SuffixPathResult } from '../types';
import {
  copyAssetsToDestination,
  getSuffixedPath,
  resolveScaledAssets,
} from './helpers';

const NAME = 'asset-register-plugin';
const ASSET_NAMESPACE = 'react-native-esbuild-assets';
const DEFAULT_PLUGIN_CONFIG: AssetRegisterPluginConfig = {
  assetExtensions: ASSET_EXTENSIONS,
};

export const createAssetRegisterPlugin: ReactNativeEsbuildPluginCreator<
  AssetRegisterPluginConfig
> = (context, config = DEFAULT_PLUGIN_CONFIG) => ({
  name: NAME,
  setup: (build) => {
    const { assetExtensions = ASSET_EXTENSIONS } = config;
    const assetExtensionsFilter = new RegExp(
      `.(${assetExtensions.join('|')})$`,
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

    /**
     * 1. Resolve platform and scale suffixed asset(eg. `image@1x.ios.png`).
     * 2. Resolve platform suffixed asset(eg. `image.ios.png`).
     * 3. Resolve scale suffixed asset(eg. `image@1x.png`).
     * 4. Resolve non-suffixed asset(eg. `image.png`).
     */
    build.onResolve({ filter: assetExtensionsFilter }, async (args) => {
      if (args.pluginData) return null;

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

    build.onLoad({ filter: /./, namespace: ASSET_NAMESPACE }, async (args) => {
      const asset = await resolveScaledAssets(context, args);

      assets.push(asset);

      return {
        resolveDir: path.dirname(args.path),
        contents: getAssetRegistrationScript(asset),
        loader: 'js',
      };
    });

    build.onEnd(async (result) => {
      // Skip copying assets when build failure.
      if (result.errors.length) return;
      await copyAssetsToDestination(context, assets);
    });
  },
});
