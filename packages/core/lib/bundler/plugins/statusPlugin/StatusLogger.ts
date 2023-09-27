import type { BuildResult } from 'esbuild';
import ora, { type Ora } from 'ora';
import { colors, isTTY } from '@react-native-esbuild/utils';
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
      prefixText: colors.bgYellow(colors.black(' » Esbuild ')),
    });
  }

  private statusUpdate(): void {
    const resolved = this.resolvedModules.size;
    const loaded = this.loadedModules;

    // Enable interactive message when only in a TTY environment
    if (isTTY()) {
      this.spinner.text = `${this.platformText} build in progress... ${(
        (loaded / resolved) * 100 || 0
      ).toFixed(2)}% (${loaded}/${resolved})`;
    }
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
    this.buildStartedAt = new Date().getTime();
    this.statusUpdate();

    isTTY()
      ? this.spinner.start()
      : this.print(`${this.platformText} build in progress...`);
  }

  summary({ warnings, errors }: BuildResult): void {
    const duration = (new Date().getTime() - this.buildStartedAt) / 1000;

    if (isTTY()) {
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
      this.print(colors.gray('╰─'), colors.cyan(`${duration}s\n`));
    } else {
      errors.length
        ? this.print(`${this.platformText} failed!`)
        : this.print(`${this.platformText} done!`);

      this.print(`> ${warnings.length} warnings`);
      this.print(`> ${errors.length} errors`);
      this.print(`> ${duration}s`);
    }
  }
}
