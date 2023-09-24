import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult } from 'esbuild';
import { logger } from '../../../shared';
import type { EsbuildPluginFactory } from '../../../types';

const NAME = 'metafile-plugin';

export const createMetafilePlugin: EsbuildPluginFactory = () => {
  return function metafilePlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        build.onEnd(async (result: BuildResult) => {
          const { metafile } = result;
          const filename = path.join(
            context.root,
            `metafile-${context.platform}-${new Date()
              .getTime()
              .toString()}.json`,
          );

          if (metafile) {
            logger.debug('writing esbuild metafile', { destination: filename });
            await fs.writeFile(filename, JSON.stringify(metafile), {
              encoding: 'utf-8',
            });
          }
        });
      },
    };
  };
};
