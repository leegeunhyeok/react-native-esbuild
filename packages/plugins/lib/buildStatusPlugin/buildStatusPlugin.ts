import path from 'node:path';
import ora, { type Ora } from 'ora';
import type { BuildResult } from 'esbuild';
import { colors } from '@react-native-esbuild/utils';
import type { PluginCreator, BuildStatusPluginConfig } from '../types';

export const createBuildStatusPlugin: PluginCreator<BuildStatusPluginConfig> = (
  config,
) => ({
  name: 'build-status-plugin',
  setup: (build): void => {
    const { printSpinner, onStart, onResolve, onLoad, onEnd } = config;
    // eslint-disable-next-line prefer-named-capture-group
    const filter = /(.*?)/;
    const moduleResolved = new Set<string>();
    let moduleLoaded = 0;
    let spinner: Ora | null = null;
    let startTime: Date | null = null;

    const updateStatusText = (): void => {
      if (!spinner) return;
      spinner.text = `build in progress... (${moduleLoaded}/${moduleResolved.size})`;
    };

    build.onStart(() => {
      moduleResolved.clear();
      moduleLoaded = 0;

      if (printSpinner) {
        spinner =
          spinner ??
          ora({
            color: 'yellow',
            prefixText: colors.bgYellow(colors.black(' » esbuild ')),
          });
        updateStatusText();
        spinner.start();
      } else {
        spinner = null;
      }

      startTime = new Date();
      onStart?.();
    });

    build.onResolve({ filter }, (args) => {
      const isRelative = args.path.startsWith('.');
      moduleResolved.add(
        isRelative ? path.resolve(args.resolveDir, args.path) : args.path,
      );

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
      const endTime = new Date().getTime() - (startTime?.getTime() ?? 0);
      const statusText = colors.gray(`(${endTime / 1000}s)`);
      result.errors.length
        ? spinner?.fail(`failed! ${statusText}`)
        : spinner?.succeed(`done! ${statusText}`);
      spinner?.stop();
      onEnd?.(result);
    });
  },
});
