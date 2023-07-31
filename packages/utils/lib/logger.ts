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

  constructor(private scope: string) {
    isCI() && disable();
  }

  private stdout(...messages: string[]): void {
    if (!this.enabled) return;
    process.stdout.write(messages.join(' ') + EOL);
  }

  private stderr(...messages: string[]): void {
    if (!this.enabled) return;
    process.stderr.write(messages.join(' ') + EOL);
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

  private getLevelTag(level: LogLevel): string {
    return this.COLOR_BY_LEVEL[level](level);
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public debug(message: string, extra?: object): void {
    this.stdout(
      this.getLevelTag('debug'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public info(message: string, extra?: object): void {
    this.stdout(
      this.getLevelTag('info'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public warn(message: string, extra?: object): void {
    this.stderr(
      this.getLevelTag('warn'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public error(message: string, extra?: object): void {
    this.stderr(
      this.getLevelTag('error'),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }
}
