import path from 'node:path';
import type { OnResolveArgs, ResolveResult } from 'esbuild';
import {
  BuildMode,
  getDevServerPublicPath,
  type PluginFactory,
} from '@react-native-esbuild/shared';
import { logger } from '../shared';
import { generateIndexPage } from './helpers';

const RESOLVE_PATTERNS = [
  // For relative path import of initializeCore.
  /node_modules\/react-native\//,
  // For import via package name.
  /^react-native$/,
];

export const createReactNativeWebPlugin: PluginFactory = (buildContext) => ({
  name: 'react-native-web-plugin',
  setup: (build): void => {
    const { root, mode } = buildContext;
    const { platform, outfile } = buildContext.bundleOptions;
    const { template, placeholders } = buildContext.config.web ?? {};
    const bundleFilename = path.basename(outfile);
    const destination =
      mode === BuildMode.Watch
        ? getDevServerPublicPath(root)
        : path.dirname(outfile);

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
