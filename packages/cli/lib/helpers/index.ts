import path from 'node:path';
import type { BundleConfig } from '@react-native-esbuild/config';
import type { Argv, StartOptions, BuildOptions } from '../types';

export function getCommand<Argv extends { _: (string | number)[] }>(
  argv: Argv,
  position = 0,
): string {
  return argv._[position].toString();
}

export function resolvePath(filepath: string): string {
  return path.resolve(process.cwd(), filepath);
}

export function getOptions(argv: Argv): StartOptions | BuildOptions {
  const entryFilePath = argv.entry
    ? resolvePath(argv.entry as string)
    : undefined;
  const sourcemapPath = argv.sourcemap
    ? resolvePath(argv.sourcemap as string)
    : undefined;
  const outputFilePath = argv.output
    ? resolvePath(argv.output as string)
    : undefined;
  const assetsDir = typeof argv.assets === 'string' ? argv.assets : undefined;
  const platform = argv.platform as BundleConfig['platform'];
  const dev = Boolean(argv.dev ?? process.env.NODE_ENV === 'development');
  const minify = Boolean(argv.minify ?? !dev);
  const verbose = typeof argv.verbose === 'boolean' ? argv.verbose : undefined;
  const timestamp = argv.timestamp;
  const resetCache =
    typeof argv.resetCache === 'boolean' ? argv.resetCache : undefined;

  const commonConfig = {
    verbose,
    resetCache,
    timestamp,
  };

  const bundleConfig: BundleConfig = {
    entry: entryFilePath,
    sourcemap: sourcemapPath,
    outfile: outputFilePath,
    assetsDir,
    platform,
    dev,
    minify,
  };

  return typeof argv.port === 'number'
    ? ({
        ...commonConfig,
        port: argv.port,
        host: argv.host,
      } as StartOptions)
    : ({ ...commonConfig, bundleConfig } as BuildOptions);
}
