import path from 'node:path';
import type { BuildResult } from 'esbuild';
import type { PluginFactory } from '@react-native-esbuild/shared';
import invariant from 'invariant';
import type { BuildStatusPluginConfig } from '../types';
import { StatusLogger } from './StatusLogger';

export const createBuildStatusPlugin: PluginFactory<BuildStatusPluginConfig> = (
  buildContext,
  config,
) => ({
  name: 'react-native-esbuild-bundler-status-plugin',
  setup: (build): void => {
    invariant(config?.handler, 'handler is required');

    const filter = /.*/;
    const statusLogger = new StatusLogger(buildContext);
    let statusLoaded = false;

    build.onStart(async () => {
      if (!statusLoaded) {
        await statusLogger.loadStatus();
        statusLoaded = true;
      }
      statusLogger.setup();
      config.handler.onBuildStart(buildContext);
    });

    build.onResolve({ filter }, (args): undefined => {
      const isRelative = args.path.startsWith('.');
      statusLogger.onResolve(
        isRelative ? path.resolve(args.resolveDir, args.path) : args.path,
      );
      config.handler.onBuild(buildContext, statusLogger.getStatus());
    });

    build.onLoad({ filter }, () => {
      statusLogger.onLoad();
      return null;
    });

    build.onEnd(async (result: BuildResult) => {
      const success = await statusLogger.summary(result);
      await statusLogger.persistStatus();
      config.handler.onBuildEnd(
        buildContext,
        { result, success },
        statusLogger.getStatus(),
      );
    });
  },
});
