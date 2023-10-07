import type { BundleOptions } from '@react-native-esbuild/config';

export interface RawArgv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export interface BaseOptions {
  verbose: boolean;
  resetCache: boolean;
}

export interface StartCommandArgv {
  startOptions: {
    host?: string;
    port?: number;
  };
  bundleOptions: Partial<BundleOptions>;
}

export interface ServeCommandArgv {
  serveOptions: {
    host?: string;
    port?: number;
    template?: string;
  };
  bundleOptions: Partial<BundleOptions>;
}

export interface BundleCommandArgv {
  bundleOptions: Partial<BundleOptions>;
}

export type Command = (argv: RawArgv, subCommand?: string) => Promise<void>;
