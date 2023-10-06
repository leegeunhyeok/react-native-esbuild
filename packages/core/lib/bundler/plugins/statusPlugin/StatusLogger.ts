import fs from 'node:fs/promises';
import path from 'node:path';
import esbuild, { type BuildResult, type Message } from 'esbuild';
import ora, { type Ora } from 'ora';
import { getBuildStatusCachePath } from '@react-native-esbuild/config';
import { colors, isTTY } from '@react-native-esbuild/utils';
import { logger } from '../../../shared';
import type { BuildStatus, PluginContext } from '../../../types';
import { fromTemplate, getSummaryTemplate } from './templates';

export class StatusLogger {
  private platformText: string;
  private spinner: Ora;
  private totalModuleCount = 0;
  private resolvedModules = new Set();
  private loadedModules = 0;
  private buildStartedAt = 0;

  constructor(private context: PluginContext) {
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
    const { resolved } = this.getStatus();
    const loaded = this.loadedModules;

    // Enable interactive message when only in a TTY environment
    if (isTTY()) {
      this.totalModuleCount = Math.max(resolved, this.totalModuleCount);
      this.spinner.text = `${this.platformText} build in progress... ${(
        (loaded / this.totalModuleCount) * 100 || 0
      ).toFixed(2)}% (${loaded}/${resolved})`;
    }
  }

  private print(...messages: string[]): void {
    process.stdout.write(`${messages.join(' ')}\n`);
  }

  private async printMessages(
    messages: Message[],
    kind: 'warning' | 'error',
  ): Promise<void> {
    const formattedMessages = await esbuild
      .formatMessages(messages, { kind, color: isTTY() })
      .catch((error) => {
        logger.error('unable to format error messages', error as Error);
        return null;
      });

    if (formattedMessages !== null) {
      formattedMessages.forEach((message) => {
        kind === 'warning' ? logger.warn(message) : logger.error(message);
        this.print(''); // trailing new line
      });
    }
  }

  getStatus(): BuildStatus {
    return {
      total: this.totalModuleCount,
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

  async summary({ warnings, errors }: BuildResult): Promise<boolean> {
    const duration = (new Date().getTime() - this.buildStartedAt) / 1000;
    const isSuccess = errors.length === 0;

    await this.printMessages(warnings, 'warning');
    await this.printMessages(errors, 'error');

    const resultText = isSuccess
      ? `${this.platformText} done!`
      : `${this.platformText} failed!`;

    if (isTTY()) {
      isSuccess
        ? this.spinner.succeed(resultText)
        : this.spinner.fail(resultText);
      this.spinner.clear();
    } else {
      this.print(resultText);
    }

    this.print(
      fromTemplate(getSummaryTemplate(), {
        warnings: colors.yellow(warnings.length.toString()),
        errors: colors.red(errors.length.toString()),
        duration: colors.cyan(duration.toString()),
      }),
    );

    return isSuccess;
  }

  loadStatus(): Promise<void> {
    return fs
      .readFile(getBuildStatusCachePath(this.context.root), 'utf-8')
      .then((data) => {
        const cachedStatus = JSON.parse(data) as unknown as {
          totalModuleCount?: number;
        };
        this.totalModuleCount = cachedStatus.totalModuleCount ?? 0;
      })
      .catch(() => void 0);
  }

  async persistStatus(): Promise<void> {
    try {
      const statusCacheFile = getBuildStatusCachePath(this.context.root);
      await fs.mkdir(path.dirname(statusCacheFile), { recursive: true });
      await fs.writeFile(
        statusCacheFile,
        JSON.stringify({ totalModuleCount: this.totalModuleCount }),
        'utf-8',
      );
    } catch (error) {
      logger.warn('cannot save build status', error as Error);
    }
  }
}
