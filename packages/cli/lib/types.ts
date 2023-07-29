export interface CliOptionsBase {
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
