import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult } from 'esbuild';
import {
  LOCAL_CACHE_DIR,
  type PluginFactory,
} from '@react-native-esbuild/shared';
import invariant from 'invariant';

export const createBundleAnalyzePlugin: PluginFactory = (buildContext) => ({
  name: 'react-native-esbuild-bundle-analyze-plugin',
  setup: (build): void => {
    build.onEnd(async (result: BuildResult) => {
      const timestamp = new Date().getTime().toString();

      await Promise.all([
        // `<projectRoot>/.rne/modules-{platform}.json`
        fs.writeFile(
          path.join(
            buildContext.root,
            LOCAL_CACHE_DIR,
            `modules-${buildContext.bundleOptions.platform}.json`,
          ),
          JSON.stringify(buildContext.moduleManager.getModuleIds(), null, 2),
        ),
        // `<projectRoot>/{timestamp}-metafile-{platform}.json`
        buildContext.bundleOptions.metafile
          ? (() => {
              invariant(result.metafile, 'metafile is empty');
              return fs.writeFile(
                path.join(
                  buildContext.root,
                  `${timestamp}-metafile-${buildContext.bundleOptions.platform}.json`,
                ),
                JSON.stringify(result.metafile),
              );
            })()
          : null,
      ]);
    });
  },
});
