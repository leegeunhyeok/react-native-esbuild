import path from 'node:path';
import type { BuildResult } from 'esbuild';
import type {
  ReactNativeEsbuildPluginCreator,
  PluginContext,
  BuildStatus,
} from '../../../types';
import { StatusLogger } from './StatusLogger';

const NAME = 'build-status-plugin';

export const createBuildStatusPlugin: ReactNativeEsbuildPluginCreator<{
  onStart: (context: PluginContext) => void;
  onUpdate: (buildState: BuildStatus, context: PluginContext) => void;
  onEnd: (
    data: {
      result: BuildResult;
      success: boolean;
    },
    context: PluginContext,
  ) => void;
}> = (context, config) => ({
  name: NAME,
  setup: (build): void => {
    const statusLogger = new StatusLogger(context);
    const filter = /.*/;
    let statusLoaded = false;

    build.onStart(async () => {
      if (!statusLoaded) {
        await statusLogger.loadStatus();
        statusLoaded = true;
      }
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

    build.onEnd(async (result: BuildResult) => {
      const success = await statusLogger.summary(result);
      await statusLogger.persistStatus();
      config?.onEnd({ result, success }, context);
    });
  },
});
