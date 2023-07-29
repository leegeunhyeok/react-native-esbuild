import yargs from 'yargs';
import * as helpers from 'yargs/helpers';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { VERSION } from './constants';
import {
  assertCommandOptions,
  resolveBundleDestination,
  getCommand,
  getOptions,
} from './helpers';
import type { StartOptions, BuildOptions } from './types';

const argv = yargs(helpers.hideBin(process.argv))
  .scriptName('rne')
  .version(VERSION)
  .usage('$0 <cmd> [args]')
  .command('start', 'start bundler with dev server', (yargs) => {
    yargs
      .options({
        port: {
          alias: 'p',
          default: 8081,
          describe: 'dev server port',
          type: 'number',
        },
        dev: {
          default: true,
          describe: 'set to develop environment',
          type: 'boolean',
        },
        minify: {
          describe: 'enable minify (by default: follow --dev)',
          type: 'boolean',
        },
      })
      .version(false)
      .help();
  })
  .command('build', 'bundle your application', (yargs) => {
    yargs
      .options({
        dev: {
          describe: 'set to develop environment',
          type: 'boolean',
        },
        minify: {
          describe: 'enable minify',
          type: 'boolean',
        },
        destination: {
          type: 'string',
          describe: 'bundle file destination',
        },
        platform: {
          type: 'string',
          describe: 'platform for resolve modules',
          choices: ['android', 'ios', 'web'],
        },
      })
      .demandOption(['dev', 'destination', 'platform'])
      .version(false)
      .help();
  })
  .demandCommand()
  .strictCommands()
  .check((argv) => assertCommandOptions(getCommand(argv), argv))
  .help().argv;

Promise.resolve(argv)
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
