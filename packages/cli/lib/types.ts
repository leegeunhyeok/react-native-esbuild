export interface Argv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export interface CliOptionsBase {
  entryFile: string;
  dev: boolean;
  minify: boolean;
}

export interface StartOptions extends CliOptionsBase {
  port: number;
}

export interface BuildOptions extends CliOptionsBase {
  destination: string;
  platform: 'android' | 'ios' | 'web';
}
