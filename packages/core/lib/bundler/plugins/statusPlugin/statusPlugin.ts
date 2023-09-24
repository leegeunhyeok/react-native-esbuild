import path from 'node:path';
import type { BuildResult } from 'esbuild';
import type { EsbuildPluginFactory, PluginContext } from '../../../types';
import { StatusLogger } from './StatusLogger';

const NAME = 'build-status-plugin';

export const createBuildStatusPlugin: EsbuildPluginFactory<{
  onStart: (context: PluginContext) => void;
  onUpdate: (
    buildState: { resolved: number; loaded: number },
    context: PluginContext,
  ) => void;
  onEnd: (result: BuildResult, context: PluginContext) => void;
}> = (config) => {
  return function buildStatusPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const statusLogger = new StatusLogger(context);
        const filter = /.*/;

        build.onStart(() => {
          statusLogger.setup();
          config?.onStart(context);
        });

        build.onResolve({ filter }, (args) => {
          const isRelative = args.path.startsWith('.');
          statusLogger.onResolve(
            isRelative ? path.resolve(args.resolveDir, args.path) : args.path,
          );
          config?.onUpdate(statusLogger.getStatus(), context);
          return null;
        });

        build.onLoad({ filter }, () => {
          statusLogger.onLoad();
          return null;
        });

        build.onEnd((result: BuildResult) => {
          statusLogger.summary(result);
          config?.onEnd(result, context);
        });
      },
    };
  };
};
