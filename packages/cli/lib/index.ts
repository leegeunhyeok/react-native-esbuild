import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { cli } from './command';
import { resolveBundleDestination, getCommand, getOptions } from './helpers';
import type { StartOptions, BuildOptions } from './types';

Promise.resolve(cli())
  .then(async (argv): Promise<void> => {
    const options = getOptions(argv);
    switch (getCommand(argv)) {
      case 'start': {
        // TODO
        const _startOptions = options as StartOptions;
        break;
      }

      case 'build': {
        const buildOptions = options as BuildOptions;
        const bundler = new ReactNativeEsbuildBundler({
          dev: buildOptions.dev,
          outfile: resolveBundleDestination(buildOptions.destination),
          platform: buildOptions.platform,
        });
        await bundler.bundle();
        break;
      }
    }
  })
  .catch(console.error);
