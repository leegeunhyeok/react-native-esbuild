import 'node-self';
import dayjs from 'dayjs';
import {
  gray,
  cyan,
  green,
  yellow,
  red,
  magenta,
  bold,
  type Color,
} from 'colors';

export enum LogLevel {
  Trace,
  Debug,
  Log,
  Info,
  Warn,
  Error,
}

self.logEnabled = false;
self.logLevel = LogLevel.Trace;
self.logTimestampFormat = null;

export class Logger {
  private static COLOR_BY_LEVEL: Record<LogLevel, Color> = {
    [LogLevel.Trace]: gray,
    [LogLevel.Debug]: gray,
    [LogLevel.Info]: cyan,
    [LogLevel.Log]: green,
    [LogLevel.Warn]: yellow,
    [LogLevel.Error]: red,
  };
  private groupDepth = 0;

  public static enable(): void {
    self.logEnabled = true;
  }

  public static disable(): void {
    self.logEnabled = false;
  }

  public static setGlobalLogLevel(level: LogLevel): void {
    self.logLevel = level;
  }

  public static setTimestampFormat(format: string | null): void {
    self.logTimestampFormat = format;
  }

  constructor(
    private scope: string,
    private logLevel?: LogLevel,
  ) {}

  private stdout(...messages: string[]): void {
    if (!self.logEnabled) return;
    process.stdout.write(this.getMessage(messages));
  }

  private stderr(...messages: string[]): void {
    if (!self.logEnabled) return;
    process.stderr.write(this.getMessage(messages));
  }

  private getMessage(messages: string[]): string {
    return `\r${this.getTimestamp()}${messages
      .filter(Boolean)
      .join(' ')
      .trimEnd()}\n`;
  }

  private getTimestamp(): string {
    if (!self.logTimestampFormat) return '';

    // eg. "2023-05-09 18:33:19.232 " (has extra padding)
    return `${gray(dayjs().format(self.logTimestampFormat as string))} `;
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
    if (!error?.stack) return '';
    return `\n${error.stack}`;
  }

  private getTagStringByLevel(level: LogLevel): string {
    switch (true) {
      case level === LogLevel.Trace:
        return 'trace';
      case level === LogLevel.Debug:
        return 'debug';
      case level === LogLevel.Log:
        return 'log';
      case level === LogLevel.Info:
        return 'info';
      case level === LogLevel.Warn:
        return 'warn';
      case level === LogLevel.Error:
        return 'error';
      default:
        return '';
    }
  }

  private getLevelTag(level: LogLevel): string {
    return bold(Logger.COLOR_BY_LEVEL[level](this.getTagStringByLevel(level)));
  }
  private getGroupPadding(options?: {
    padding?: string;
    last?: string;
  }): string {
    const { padding = '│', last } = options ?? {};
    if (this.groupDepth === 0 && last) return last;
    if (this.groupDepth === 0) return '';
    const paddingArray = new Array(this.groupDepth).fill(padding);

    if (last) paddingArray[paddingArray.length - 1] = last;

    return gray(paddingArray.join(''));
  }

  public getLogLevel(): LogLevel {
    return this.logLevel ?? (self.logLevel as LogLevel);
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public trace(message: string, extra?: object): void {
    if (this.getLogLevel() > LogLevel.Trace) return;

    this.stdout(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Trace),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public debug(message: string, extra?: object): void {
    if (this.getLogLevel() > LogLevel.Debug) return;

    this.stdout(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Debug),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public log(message: string, extra?: object): void {
    if (this.getLogLevel() > LogLevel.Log) return;

    this.stdout(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Log),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public info(message: string, extra?: object): void {
    if (this.getLogLevel() > LogLevel.Info) return;

    this.stdout(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Info),
      magenta(this.scope),
      message,
      this.parseExtra(extra),
    );
  }

  public warn(message: string, error?: Error, extra?: object): void {
    if (this.getLogLevel() > LogLevel.Warn) return;

    this.stderr(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Warn),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }

  public error(message: string, error?: Error, extra?: object): void {
    this.stderr(
      this.getGroupPadding(),
      this.getLevelTag(LogLevel.Error),
      magenta(this.scope),
      message,
      this.parseError(error),
      this.parseExtra(extra),
    );
  }

  public group(...label: string[]): void {
    ++this.groupDepth;
    this.stdout(this.getGroupPadding({ last: '╭─' }), ...label);
  }

  public groupEnd(): void {
    this.stdout(this.getGroupPadding({ last: '╰───◯' }));
    --this.groupDepth;
  }
}
