import fs from 'node:fs/promises';
import { transform } from '@svgr/core';
import { registerAsExternalModule } from '@react-native-esbuild/hmr';
import type { PluginFactory } from '@react-native-esbuild/shared';
import { defaultTemplate, SVG_COMPONENT_NAME } from './templates';

export const createSvgTransformPlugin: PluginFactory = (buildContext) => ({
  name: 'react-native-esbuild-svg-transform-plugin',
  setup: (build): void => {
    const isNative = ['android', 'ios'].includes(
      buildContext.bundleOptions.platform,
    );

    build.onLoad({ filter: /\.svg$/ }, async (args) => {
      const moduleId = buildContext.moduleManager.getModuleId(args.path);
      const rawSvg = await fs.readFile(args.path, { encoding: 'utf8' });
      const svgTransformedCode = await transform(
        rawSvg,
        {
          template: defaultTemplate,
          plugins: ['@svgr/plugin-jsx'],
          native: isNative,
        },
        { filePath: args.path },
      );

      return {
        contents: buildContext.flags.hmrEnabled
          ? registerAsExternalModule(
              moduleId,
              svgTransformedCode,
              SVG_COMPONENT_NAME,
            )
          : svgTransformedCode,
        loader: 'jsx',
      };
    });
  },
});
