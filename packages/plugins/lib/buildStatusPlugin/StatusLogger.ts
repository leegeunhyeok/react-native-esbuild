import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import esbuild, { type BuildResult, type Message } from 'esbuild';
import ora, { type Ora } from 'ora';
import {
  colors,
  isTTY,
  getBuildStatusCachePath,
  BuildMode,
  ESBUILD_LABEL,
  type BuildStatus,
  type BuildContext,
} from '@react-native-esbuild/shared';
import { logger } from '../shared';
import { fromTemplate, getSummaryTemplate } from './templates';

export class StatusLogger {
  private platformText: string;
  private spinner: Ora;
  private totalModuleCount = 0;
  private resolvedModules = new Set();
  private loadedModules = 0;
  private previousPercent = 0;

  constructor(private context: BuildContext) {
    this.platformText = colors.gray(
      `[${[
        context.bundleOptions.platform,
        context.bundleOptions.dev ? 'dev' : null,
      ]
        .filter(Boolean)
        .join(', ')}]`,
    );
    this.spinner = ora({
      color: 'yellow',
      discardStdin: context.mode === BuildMode.Bundle,
      prefixText: colors.bgYellow(colors.black(ESBUILD_LABEL)),
    });
  }

  private updateStatus(): void {
    const { resolved } = this.getStatus();
    const loaded = this.loadedModules;

    // Enable interactive message when only in a TTY environment.
    if (isTTY()) {
      this.totalModuleCount = Math.max(resolved, this.totalModuleCount);
      const percent = Math.min(
        (loaded / this.totalModuleCount) * 100 || 0,
        100,
      );

      // To avoid percent value reduction.
      if (this.previousPercent === 100 || this.previousPercent < percent) {
        this.previousPercent = percent;
      }

      this.spinner.text = `${this.platformText} build in progress... ${Math.max(
        this.previousPercent,
        percent,
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
    this.updateStatus();
  }

  setup(): void {
    performance.clearMarks(`bundle:${this.context.id}`);
    performance.mark(`bundle:${this.context.id}`);
    this.resolvedModules.clear();
    this.loadedModules = 0;
    this.previousPercent = 0;
    this.updateStatus();

    process.stdout.write('\n');
    isTTY()
      ? this.spinner.start()
      : this.print(`${this.platformText} build in progress...`);
  }

  async summary({ warnings, errors }: BuildResult): Promise<boolean> {
    const { duration } = performance.measure(
      `bundle-duration:${this.context.id}`,
      `bundle:${this.context.id}`,
    );
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
        duration: colors.cyan((duration / 1000).toFixed(3)),
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
