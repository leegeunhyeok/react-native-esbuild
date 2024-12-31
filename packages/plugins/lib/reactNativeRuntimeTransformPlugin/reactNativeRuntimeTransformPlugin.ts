import fs from 'node:fs/promises';
import path from 'node:path';
import type { PluginFactory } from '@react-native-esbuild/shared';
import { logger } from '../shared';
import { enhanceTransformer, transformJsonAsJsModule } from './helpers';

export const createReactNativeRuntimeTransformPlugin: PluginFactory = (
  buildContext,
) => ({
  name: 'react-native-runtime-transform-plugin',
  setup: (build): void => {
    const filter = /\.(?:[mc]js|[tj]sx?)$/;
    const transformer = enhanceTransformer(buildContext);

    // transformJsonAsJsModule(buildContext, build);

    build.onResolve({ filter }, (args) => {
      if (args.kind === 'entry-point') {
        return {
          path: args.path,
          pluginData: { isEntryPoint: true },
        };
      }
    });

    build.onLoad({ filter }, async (args) => {
      const moduleId = buildContext.moduleManager.getModuleId(
        args.path,
        args.pluginData?.isEntryPoint,
      );
      let handle: fs.FileHandle | undefined;

      try {
        handle = await fs.open(args.path);
        const stat = await handle.stat();
        const rawCode = await handle.readFile({ encoding: 'utf-8' });
        const code = await transformer(rawCode, {
          id: moduleId,
          path: args.path,
          pluginData: {
            ...args.pluginData,
            mtimeMs: stat.mtimeMs,
            externalPattern: buildContext.additionalData.externalPattern,
          },
        });

        return { contents: code, loader: 'js' };
      } finally {
        try {
          await handle?.close();
        } catch (error) {
          logger.error('unexpected error', error);
          process.exit(1);
        }
      }
    });

    build.onEnd(async (args) => {
      if (args.errors.length) return;

      if (
        !(build.initialOptions.outfile && buildContext.bundleOptions.sourcemap)
      ) {
        logger.debug('outfile or sourcemap path is not specified');
        return;
      }

      const sourceDirectory = path.dirname(build.initialOptions.outfile);
      const sourceName = path.basename(build.initialOptions.outfile);
      const sourceMapPath = path.join(sourceDirectory, `${sourceName}.map`);

      logger.debug('move sourcemap to specified path', {
        from: sourceMapPath,
        to: buildContext.bundleOptions.sourcemap,
      });

      await fs.rename(sourceMapPath, buildContext.bundleOptions.sourcemap);
    });
  },
});
