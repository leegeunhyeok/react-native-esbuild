import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import { cli } from './command';
import { getCommand, getOptions } from './helpers';
import type { StartOptions, BuildOptions } from './types';
import { logger } from './shared';

Promise.resolve(cli())
  .then(async (argv): Promise<void> => {
    const options = getOptions(argv);

    logger.setLogLevel(options.debug ? 'debug' : 'info');
    logger.debug('command line interface options', options);

    switch (getCommand(argv)) {
      case 'start': {
        const startOptions = options as StartOptions;
        const devServer = new ReactNativeEsbuildDevServer({
          host: startOptions.host,
          port: startOptions.port,
        }).initialize({
          entryPoint: startOptions.entryFile,
          outfile: startOptions.outputFile,
          assetsDir: startOptions.assetsDir,
          dev: startOptions.dev,
          minify: startOptions.minify,
        });
        devServer.listen();
        break;
      }

      case 'build': {
        const buildOptions = options as BuildOptions;
        const bundler = new ReactNativeEsbuildBundler({
          entryPoint: buildOptions.entryFile,
          outfile: buildOptions.outputFile,
          assetsDir: buildOptions.assetsDir,
          dev: buildOptions.dev,
          minify: buildOptions.minify,
        });
        await bundler.bundle(buildOptions.platform);
        break;
      }
    }
  })
  .catch((error) => logger.error('cannot execute command', error as Error));
