import type { BundleConfig } from '@react-native-esbuild/config';

export interface Argv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export interface CliOptionsBase {
  verbose: boolean;
  timestamp: boolean;
  resetCache: boolean;
}

export interface StartOptions extends CliOptionsBase {
  port?: number;
  host?: string;
}

export interface BuildOptions extends CliOptionsBase {
  bundleConfig: BundleConfig;
}
