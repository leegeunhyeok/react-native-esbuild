import type { BuildResult } from 'esbuild';
import ora, { type Ora } from 'ora';
import { colors } from '@react-native-esbuild/utils';
import type { PluginContext } from '../../../types';

export class StatusLogger {
  private platformText: string;
  private spinner: Ora;
  private resolvedModules = new Set();
  private loadedModules = 0;
  private buildStartedAt = 0;

  constructor(context: PluginContext) {
    this.platformText = colors.gray(
      `[${[context.platform, context.dev ? 'dev' : null]
        .filter(Boolean)
        .join(', ')}]`,
    );
    this.spinner = ora({
      color: 'yellow',
      discardStdin: context.mode === 'bundle',
      prefixText: colors.bgYellow(colors.black(' » esbuild ')),
    });
  }

  private statusUpdate(): void {
    const resolved = this.resolvedModules.size;
    const loaded = this.loadedModules;
    this.spinner.text = `${this.platformText} build in progress... ${(
      (loaded / resolved) * 100 || 0
    ).toFixed(2)}% (${loaded}/${resolved})`;
  }

  private print(...messages: string[]): void {
    process.stdout.write(`${messages.join(' ')}\n`);
  }

  getStatus(): { resolved: number; loaded: number } {
    return {
      resolved: this.resolvedModules.size,
      loaded: this.loadedModules,
    } as const;
  }

  onResolve(resolvedPath: string): void {
    this.resolvedModules.add(resolvedPath);
  }

  onLoad(): void {
    ++this.loadedModules;
    this.statusUpdate();
  }

  setup(): void {
    this.resolvedModules.clear();
    this.loadedModules = 0;
    this.spinner.start();
    this.buildStartedAt = new Date().getTime();
    this.statusUpdate();
  }

  summary({ warnings, errors }: BuildResult): void {
    const duration = new Date().getTime() - this.buildStartedAt;

    errors.length
      ? this.spinner.fail(`${this.platformText} failed!`)
      : this.spinner.succeed(`${this.platformText} done!`);

    this.spinner.clear();
    this.print(colors.gray('╭───────────╯'));
    this.print(
      colors.gray('├─'),
      colors.yellow(warnings.length.toString()),
      colors.gray('warnings'),
    );
    this.print(
      colors.gray('├─'),
      colors.red(errors.length.toString()),
      colors.gray('errors'),
    );
    this.print(colors.gray('╰─'), colors.cyan(`${duration / 1000}s\n`));
  }
}
