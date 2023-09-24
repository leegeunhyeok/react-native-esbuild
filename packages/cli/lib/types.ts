import type { BundleConfig } from '@react-native-esbuild/config';

export interface RawArgv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export interface CliOptionsBase {
  verbose: boolean;
  resetCache: boolean;
}

export interface StartOptions extends CliOptionsBase {
  port?: number;
  host?: string;
}

export interface BuildOptions extends CliOptionsBase {
  bundleConfig: Partial<BundleConfig>;
}

export type Command<CommandOptions extends CliOptionsBase = CliOptionsBase> = (
  options: CommandOptions,
  subCommand?: string,
) => Promise<void>;
