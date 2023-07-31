import { EOL } from 'node:os';
import { gray, cyan, yellow, red, magenta, disable } from 'colors';
import type { Color } from 'colors';
import type { LogLevel } from './types';
import { isCI } from './env';

export class Logger {
  private COLOR_BY_LEVEL: Record<LogLevel, Color> = {
    debug: gray,
    info: cyan,
    warn: yellow,
    error: red,
  };
  private enabled = true;
  private logLevel = 'info';

  constructor(private scope: string) {
    isCI() && disable();
  }

  private stdout(...messages: string[]): void {
    if (!this.enabled) return;
    process.stdout.write(this.getMessage(messages));
  }

  private stderr(...messages: string[]): void {
    if (!this.enabled) return;
    process.stderr.write(this.getMessage(messages));
  }

  private getMessage(messages: string[]): string {
    return messages.filter(Boolean).join(' ') + EOL;
  }

  private parseExtra(extra?: object): string {
    let extraString = '';
    if (typeof extra === 'object') {
      try {
        extraString = gray(`\n${JSON.stringify(extra, null, 2)}`);
      } catch (error) {
        extraString = gray('[extra parse error]');
      }
    }
    return extraString;
  }

  private parseError(error?: Error): string {
    if (!error) return '';
    return error.message + (error.stack ? `\n${error.stack}` : '');
  }

  private getLevelTag(level: LogLevel): string {
    return this.COLOR_BY_LEVEL[level](level);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string, extra?: object): void {
    if (this.logLevel !== 'debug') return;

    this.stdout(
      this.getLevelTag('debug'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public info(message: string, extra?: object): void {
    if (['warn', 'error'].some((level) => level === this.logLevel)) return;

    this.stdout(
      this.getLevelTag('info'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public warn(message: string, error?: Error, extra?: object): void {
    if (['error'].some((level) => level === this.logLevel)) return;

    this.stderr(
      this.getLevelTag('warn'),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }

  public error(message: string, error: Error, extra?: object): void {
    this.stderr(
      this.getLevelTag('error'),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }
}
