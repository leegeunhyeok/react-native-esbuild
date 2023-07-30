export interface Argv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export interface CliOptionsBase {
  entryFile: string;
  outputFile: string;
  assetsDir: string;
  dev: boolean;
  minify: boolean;
}

export interface StartOptions extends CliOptionsBase {
  port: number;
  host: string;
}

export interface BuildOptions extends CliOptionsBase {
  platform: 'android' | 'ios' | 'web';
}
