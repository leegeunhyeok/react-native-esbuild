import type { BuildOptions } from 'esbuild';
import { getPreludeScript } from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';
import type { BundleOptions } from '@react-native-esbuild/config';

export const getTransformedPreludeScript = async (
  bundleOptions: BundleOptions,
  root: string,
): Promise<string> => {
  const context = { root, path: '' };
  const preludeScript = await getPreludeScript(bundleOptions, root);

  /**
   * Remove `"use strict";` added by sucrase.
   * @see {@link https://github.com/alangpierce/sucrase/issues/787#issuecomment-1483934492}
   */
  const strippedScript = stripFlowWithSucrase(preludeScript, context)
    .replace(/"use strict";/, '')
    .trim();

  return bundleOptions.minify
    ? minifyWithSwc(strippedScript, context, {
        overrideOptions: {
          compress: true,
          mangle: true,
          sourceMap: false,
        },
      })
    : strippedScript;
};

export const getResolveExtensionsOption = (
  bundleOptions: BundleOptions,
  sourceExtensions: string[],
  assetExtensions: string[],
): BuildOptions['resolveExtensions'] => {
  const extensions = [...sourceExtensions, ...assetExtensions];
  /**
   * Platform specified extensions for resolve priority.
   *
   * (High ~ Low)
   * 1. `filename.<platform>.ext`
   * 2. `filename.native.ext` (only platform is `android` or `ios`)
   * 3. `filename.react-native.ext` (only platform is `android` or `ios`)
   * 4. `filename.ext`
   */
  return [
    bundleOptions.platform,
    ...(bundleOptions.platform === 'web' ? [] : ['native', 'react-native']),
  ]
    .filter(Boolean)
    .map((platform) => extensions.map((ext) => `.${platform}${ext}`))
    .concat(extensions)
    .flat();
};

export const getLoaderOption = (
  assetExtensions: string[],
): BuildOptions['loader'] => {
  /**
   * Loader option for file loader interprets the assets as file.
   */
  return Object.fromEntries(
    assetExtensions.map((ext) => [ext, 'file'] as const),
  );
};
