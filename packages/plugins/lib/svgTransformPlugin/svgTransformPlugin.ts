import fs from 'node:fs/promises';
import { transform } from '@svgr/core';
import type {
  EsbuildPluginFactory,
  PluginContext,
} from '@react-native-esbuild/core';

const NAME = 'svg-transform-plugin';

export const createSvgTransformPlugin: EsbuildPluginFactory = () => {
  return function svgTransformPlugin(context: PluginContext) {
    return {
      name: NAME,
      setup: (build): void => {
        if (!(context.config.transformer?.convertSvg ?? false)) {
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
    };
  };
};
