import path from 'node:path';
import type { BuildResult, Message } from 'esbuild';
import ora from 'ora';
import { colors } from '@react-native-esbuild/utils';
import { logger } from '../../shared';
import type { EsbuildPluginFactory, PluginContext } from '../../types';

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
        const spinner = ora({
          color: 'yellow',
          discardStdin: context.mode === 'bundle',
          prefixText: colors.bgYellow(colors.black(' » esbuild ')),
        });

        const filter = /.*/;
        const moduleResolved = new Set<string>();
        const platformText = colors.gray(
          `[${[context.platform, context.dev ? 'dev' : null]
            .filter(Boolean)
            .join(', ')}]`,
        );

        let startTime: Date | null = null;
        let moduleLoaded = 0;

        const handleUpdate = (): void => {
          const resolved = moduleResolved.size;
          const loaded = moduleLoaded;
          config?.onUpdate(
            {
              resolved,
              loaded,
            },
            context,
          );

          spinner.text = `${platformText} build in progress... ${(
            (loaded / resolved) *
            100
          ).toFixed(2)}% (${loaded}/${resolved})`;
        };

        const print = (...messages: string[]): void => {
          process.stdout.write(`${messages.join(' ')}\n`);
        };

        const printSummary = (
          warnings: Message[],
          errors: Message[],
          duration: number,
        ): void => {
          print(colors.gray('╭───────────╯'));
          print(
            colors.gray('├─'),
            colors.yellow(warnings.length.toString()),
            colors.gray('warnings'),
          );
          print(
            colors.gray('├─'),
            colors.red(errors.length.toString()),
            colors.gray('errors'),
          );
          print(colors.gray('╰─'), colors.cyan(`${duration / 1000}s\n`));
        };

        build.onStart(() => {
          logger.debug('esbuild.onStart');
          moduleResolved.clear();
          moduleLoaded = 0;
          handleUpdate();
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
          handleUpdate();
          return null;
        });

        build.onEnd((result: BuildResult) => {
          logger.debug('esbuild.onEnd');
          const { warnings, errors } = result;
          const duration = new Date().getTime() - (startTime?.getTime() ?? 0);
          spinner.clear();

          warnings.forEach((warning) => {
            logger.warn(warning.text, undefined, warning.location ?? undefined);
          });

          errors.forEach((error) => {
            logger.error(error.text, undefined, error.location ?? undefined);
          });

          errors.length
            ? spinner.fail(`${platformText} failed!`)
            : spinner.succeed(`${platformText} done!`);

          printSummary(warnings, errors, duration);

          config?.onEnd(result, context);
        });
      },
    };
  };
};
