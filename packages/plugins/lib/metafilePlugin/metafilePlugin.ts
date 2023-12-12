import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult } from 'esbuild';
import type { PluginFactory } from '@react-native-esbuild/shared';
import { logger } from '../shared';

export const createMetafilePlugin: PluginFactory = (buildContext) => ({
  name: 'react-native-esbuild-metafile-plugin',
  setup: (build): void => {
    build.onEnd(async (result: BuildResult) => {
      if (!(buildContext.bundleOptions.metafile && result.metafile)) return;

      const filename = path.join(
        buildContext.root,
        `metafile-${buildContext.bundleOptions.platform}-${new Date()
          .getTime()
          .toString()}.json`,
      );
      logger.debug('writing esbuild metafile', { destination: filename });

      await fs.writeFile(filename, JSON.stringify(result.metafile), {
        encoding: 'utf-8',
      });
    });
  },
});
