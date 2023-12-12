import fs from 'node:fs/promises';
import type { BuildOptions } from 'esbuild';
import { getPreludeScript } from '@react-native-esbuild/internal';
import type { TransformerContext } from '@react-native-esbuild/transformer';
import {
  stripFlowWithSucrase,
  transformWithSwc,
  swcPresets,
} from '@react-native-esbuild/transformer';
import type { BundleOptions } from '@react-native-esbuild/config';

const loadScript = (path: string): Promise<string> =>
  fs.readFile(require.resolve(path), 'utf-8');

export const getTransformedPreludeScript = async (
  bundleOptions: BundleOptions,
  root: string,
  additionalScriptPaths?: string[],
): Promise<string> => {
  // Dummy context
  const context: TransformerContext = {
    root,
    path: '',
    id: 0,
    dev: bundleOptions.dev,
    entry: bundleOptions.entry,
  };

  const additionalPreludeScripts = await Promise.all(
    (additionalScriptPaths ?? []).map(loadScript),
  );

  const preludeScript = [
    await getPreludeScript(bundleOptions, root),
    ...additionalPreludeScripts,
  ].join('\n');

  /**
   * Remove `"use strict";` added by sucrase.
   * @see {@link https://github.com/alangpierce/sucrase/issues/787#issuecomment-1483934492}
   */
  const strippedScript = stripFlowWithSucrase(preludeScript, { context })
    .replace(/"use strict";/, '')
    .trim();

  return transformWithSwc(strippedScript, {
    context,
    preset: swcPresets.getMinifyPreset({ minify: bundleOptions.minify }),
  });
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

export const getExternalModulePattern = (
  externalPackages: string[],
  assetExtensions: string[],
): string => {
  const externalPackagePatterns = externalPackages
    .map((packageName) => `^${packageName}/?$`)
    .join('|');

  const assetPatterns = [
    ...assetExtensions,
    // `.svg` assets will be handled by `svg-transform-plugin`.
    '.svg',
    // `.json` contents will be handled by `react-native-runtime-transform-plugin`.
    '.json',
  ]
    .map((extension) => `${extension}$`)
    .join('|');

  return `(${externalPackagePatterns}|${assetPatterns})`;
};
