import ora, { type Ora } from 'ora';
import type { BuildResult } from 'esbuild';
import type { PluginCreator, BuildStatusPluginConfig } from '../types';

export const createBuildStatusPlugin: PluginCreator<BuildStatusPluginConfig> = (
  config,
) => ({
  name: 'build-status-plugin',
  setup: (build): void => {
    const { printSpinner, onStart, onResolve, onLoad, onEnd } = config;
    // eslint-disable-next-line prefer-named-capture-group
    const filter = /(.*?)/;
    let spinner: Ora | null = null;
    let moduleLoaded = 0;

    const updateStatusText = (): void => {
      if (!spinner) return;
      spinner.text = `build in progress... (loaded: ${moduleLoaded})`;
    };

    build.onStart(() => {
      moduleLoaded = 0;

      if (printSpinner && !spinner) {
        spinner = ora({ color: 'green' });
        updateStatusText();
        spinner.start();
      } else {
        spinner = null;
      }
      onStart?.();
    });

    build.onResolve({ filter }, (args) => {
      onResolve?.(args.path);
      return null;
    });

    build.onLoad({ filter }, (args) => {
      ++moduleLoaded;
      updateStatusText();
      onLoad?.(args.path);
      return null;
    });

    build.onEnd((result: BuildResult<{ write: false }>) => {
      result.errors.length
        ? spinner?.fail('failed!')
        : spinner?.succeed('done!');
      spinner?.stop();
      onEnd?.(result);
    });
  },
});
