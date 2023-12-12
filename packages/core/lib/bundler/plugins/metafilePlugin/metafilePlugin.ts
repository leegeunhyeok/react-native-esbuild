import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult } from 'esbuild';
import { logger } from '../../../shared';
import type { ReactNativeEsbuildPluginCreator } from '../../../types';

const NAME = 'metafile-plugin';

export const createMetafilePlugin: ReactNativeEsbuildPluginCreator = (
  context,
) => ({
  name: NAME,
  setup: (build): void => {
    build.onEnd(async (result: BuildResult) => {
      if (!(context.metafile && result.metafile)) return;

      const filename = path.join(
        context.root,
        `metafile-${context.platform}-${new Date().getTime().toString()}.json`,
      );
      logger.debug('writing esbuild metafile', { destination: filename });
      await fs.writeFile(filename, JSON.stringify(result.metafile), {
        encoding: 'utf-8',
      });
    });
  },
});
