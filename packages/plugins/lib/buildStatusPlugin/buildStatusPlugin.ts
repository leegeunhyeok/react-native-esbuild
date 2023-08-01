import ora, { type Ora } from 'ora';
import type { BuildResult } from 'esbuild';
import type { PluginCreator, BuildStatusPluginConfig } from '../types';

export const createBuildStatusPlugin: PluginCreator<BuildStatusPluginConfig> = (
  config,
) => ({
  name: 'build-status-plugin',
  setup: (build): void => {
    const { printSpinner, onStart, onResolve, onLoad, onEnd } = config;
    let spinner: Ora | null = null;

    build.onStart(() => {
      if (printSpinner) {
        spinner = ora({
          color: 'green',
          text: 'build in progress...',
        });
        spinner.start();
      } else {
        spinner = null;
      }
      onStart?.();
    });

    build.onResolve({ filter: /\*./ }, (args) => {
      onResolve?.(args.path);
      return null;
    });

    build.onLoad({ filter: /\*./ }, (args) => {
      onLoad?.(args.path);
      return null;
    });

    build.onEnd((result: BuildResult<{ write: false }>) => {
      spinner?.succeed('done!');
      spinner?.stop();
      onEnd?.(result);
    });
  },
});
