import fs from 'node:fs/promises';
import { transform } from '@svgr/core';
import type { PluginCreator } from '../types';

const NAME = 'svg-transform-plugin';

export const createSvgTransformPlugin: PluginCreator<null> = (
  _config,
  context,
) => ({
  name: NAME,
  setup: (build): void => {
    if (!(context.config.transform.svgr ?? false)) {
      return;
    }

    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const rawSvg = await fs.readFile(args.path, { encoding: 'utf8' });
      return {
        contents: await transform(
          rawSvg,
          {
            plugins: ['@svgr/plugin-jsx'],
            native: true,
          },
          { filePath: args.path },
        ),
        loader: 'jsx',
      };
    });
  },
});
