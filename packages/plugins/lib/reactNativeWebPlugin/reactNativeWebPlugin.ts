import path from 'node:path';
import type { OnResolveArgs, ResolveResult } from 'esbuild';
import type { ReactNativeEsbuildPluginCreator } from '@react-native-esbuild/core';
import { getDevServerPublicPath } from '@react-native-esbuild/config';
import { logger } from '../shared';
import { generateIndexPage } from './helpers';

const NAME = 'react-native-web-plugin';
const RESOLVE_PATTERNS = [
  // For relative path import of initializeCore.
  /node_modules\/react-native\//,
  // For import via package name.
  /^react-native$/,
];

export const createReactNativeWebPlugin: ReactNativeEsbuildPluginCreator = (
  context,
) => ({
  name: NAME,
  setup: (build): void => {
    const { root, platform, outfile, mode } = context;
    const { template, placeholders } = context.config.web ?? {};
    const destination =
      mode === 'watch' ? getDevServerPublicPath(root) : path.dirname(outfile);
    const bundleFilename = path.basename(outfile);

    if (platform !== 'web') return;

    const resolveReactNativeWeb = (
      args: OnResolveArgs,
    ): Promise<ResolveResult> => {
      return build.resolve('react-native-web', {
        kind: args.kind,
        resolveDir: args.resolveDir,
        importer: args.importer,
      });
    };

    RESOLVE_PATTERNS.forEach((pattern) => {
      build.onResolve({ filter: pattern }, resolveReactNativeWeb);
    });

    build.onEnd(async (result) => {
      if (result.errors.length) return;
      if (!template) {
        logger.warn('template is not specified');
        return;
      }

      await generateIndexPage(template, destination, {
        ...placeholders,
        _bundle: bundleFilename.endsWith('.js')
          ? bundleFilename
          : `${bundleFilename}.js`,
      });
    });
  },
});
