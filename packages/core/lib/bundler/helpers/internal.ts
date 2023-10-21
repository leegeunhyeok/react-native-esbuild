import {
  ASSET_EXTENSIONS,
  SOURCE_EXTENSIONS,
  getPreludeScript,
} from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';
import type { BuildOptions } from 'esbuild';
import type { BundleOptions } from '@react-native-esbuild/config';

export const getTransformedPreludeScript = async (
  bundleOptions: BundleOptions,
  root: string,
): Promise<string> => {
  const context = { root, path: '' };
  const preludeScript = await getPreludeScript(bundleOptions, root);

  /**
   * remove "use strict";
   * @see {@link https://github.com/alangpierce/sucrase/issues/787#issuecomment-1483934492}
   */
  const strippedScript = (await stripFlowWithSucrase(preludeScript, context))
    .replace(/"use strict";/, '')
    .trim();

  return bundleOptions.minify
    ? minifyWithSwc(strippedScript, context, {
        customOptions: {
          compress: true,
          mangle: true,
          sourceMap: false,
        },
      })
    : strippedScript;
};

export const getResolveExtensionsOption = (
  bundleOptions: BundleOptions,
): BuildOptions['resolveExtensions'] => {
  const extensions = [...SOURCE_EXTENSIONS, ...ASSET_EXTENSIONS];
  /**
   * platform specified extensions for resolve priority
   *
   * 1. `.<platform>.ext`
   * 2. `.native.ext`
   * 3. `.ext`
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

export const getLoaderOption = (): BuildOptions['loader'] => {
  /**
   * loader option for file loader interprets the assets as file
   */
  return Object.fromEntries(
    ASSET_EXTENSIONS.map((ext) => [ext, 'file'] as const),
  );
};
