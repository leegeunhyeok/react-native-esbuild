import 'node-self';
import { EOL } from 'node:os';
import { gray, cyan, green, yellow, red, magenta, bold, disable } from 'colors';
import type { Color } from 'colors';
import type { LogLevel } from './types';
import { isCI } from './env';

self.logLevel = 'info';
self.timestampEnabled = false;

export class Logger {
  private COLOR_BY_LEVEL: Record<LogLevel, Color> = {
    debug: gray,
    info: cyan,
    log: green,
    warn: yellow,
    error: red,
  };

  constructor(private scope: string) {
    isCI() && disable();
  }

  private stdout(...messages: string[]): void {
    if (self.logEnabled === false) return;
    process.stdout.write(this.getMessage(messages));
  }

  private stderr(...messages: string[]): void {
    if (self.logEnabled === false) return;
    process.stderr.write(this.getMessage(messages));
  }

  private getMessage(messages: string[]): string {
    return `\r${this.getTimestamp()}${messages
      .filter(Boolean)
      .join(' ')
      .trimEnd()}${EOL}`;
  }

  private getTimestamp(): string {
    if (!self.timestampEnabled) return '';

    // eg. "2023-05-09 18:33:19.232 "
    const date = new Date();
    return gray(
      `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}.${date
        .getMilliseconds()
        .toString()
        .padStart(3, '0')} `,
    );
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
    return bold(this.COLOR_BY_LEVEL[level](level));
  }

  public enable(): void {
    self.logEnabled = true;
  }

  public disable(): void {
    self.logEnabled = false;
  }

  public setLogLevel(level: LogLevel): void {
    self.logLevel = level;
  }

  public setTimestampEnabled(enable: boolean): void {
    self.timestampEnabled = enable;
  }

  public debug(message: string, extra?: object): void {
    if (self.logLevel !== 'debug') return;

    this.stdout(
      this.getLevelTag('debug'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public log(message: string, extra?: object): void {
    if (['warn', 'error'].some((level) => level === self.logLevel)) {
      return;
    }

    this.stdout(
      this.getLevelTag('log'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public info(message: string, extra?: object): void {
    if (['warn', 'error'].some((level) => level === self.logLevel)) return;

    this.stdout(
      this.getLevelTag('info'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public warn(message: string, error?: Error, extra?: object): void {
    if (['error'].some((level) => level === self.logLevel)) return;

    this.stderr(
      this.getLevelTag('warn'),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }

  public error(message: string, error?: Error, extra?: object): void {
    this.stderr(
      this.getLevelTag('error'),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }
}
