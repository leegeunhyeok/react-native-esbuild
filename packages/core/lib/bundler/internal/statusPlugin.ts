import path from 'node:path';
import type { BuildResult } from 'esbuild';
import ora from 'ora';
import { colors } from '@react-native-esbuild/utils';
import { logger } from '../../shared';
import type { EsbuildPluginFactory, PluginContext } from '../../types';

const NAME = 'build-status-plugin';

export const createBuildStatusPlugin: EsbuildPluginFactory<{
  onStart: (context: PluginContext) => void;
  onEnd: (result: BuildResult, context: PluginContext) => void;
}> = (config) => {
  return function buildStatusPlugin(context) {
    return {
      name: NAME,
      setup: (build): void => {
        const spinner = ora({
          color: 'yellow',
          prefixText: colors.bgYellow(colors.black(' » esbuild ')),
        });

        // eslint-disable-next-line prefer-named-capture-group
        const filter = /(.*?)/;
        const moduleResolved = new Set<string>();
        let startTime: Date | null = null;
        let moduleLoaded = 0;

        const updateStatusText = (): void => {
          spinner.text = `build in progress... (${moduleLoaded}/${moduleResolved.size})`;
        };

        build.onStart(() => {
          moduleResolved.clear();
          moduleLoaded = 0;
          updateStatusText();
          spinner.start();
          startTime = new Date();
          config?.onStart(context);
        });

        build.onResolve({ filter }, (args) => {
          const isRelative = args.path.startsWith('.');
          moduleResolved.add(
            isRelative ? path.resolve(args.resolveDir, args.path) : args.path,
          );
          return null;
        });

        build.onLoad({ filter }, () => {
          ++moduleLoaded;
          updateStatusText();
          return null;
        });

        build.onEnd((result: BuildResult) => {
          const { warnings, errors } = result;
          const endTime = new Date().getTime() - (startTime?.getTime() ?? 0);
          const duration = colors.gray(`(${endTime / 1000}s)`);
          spinner.clear();

          const status = `(${colors.yellow(
            warnings.length.toString(),
          )} warnings, ${colors.red(errors.length.toString())} errors)`;

          warnings.forEach((warning) => {
            logger.warn(warning.text, undefined, warning.location ?? undefined);
          });

          errors.forEach((error) => {
            logger.error(error.text, undefined, error.location ?? undefined);
          });

          errors.length
            ? spinner.fail(`failed! ${status} ${duration}`)
            : spinner.succeed(`done! ${status} ${duration}`);

          config?.onEnd(result, context);
        });
      },
    };
  };
};
