import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_WEB_ENTRY_POINT,
} from '@react-native-esbuild/config';
import { VERSION } from './constants';
import type { RawArgv } from './types';

const commonOptions = {
  config: {
    describe: 'Path to the bundler configuration file',
    type: 'string',
  },
  verbose: {
    describe: 'Print all logs',
    type: 'boolean',
    default: false,
  },
  'reset-cache': {
    describe: 'Reset transform cache',
    type: 'boolean',
    default: false,
  },
} as const;

export const cli = (): RawArgv | Promise<RawArgv> => {
  return yargs(hideBin(process.argv))
    .scriptName('rne')
    .version(VERSION)
    .usage('$0 <cmd> [args]')
    .command(
      'start',
      'Start the development server for Native(Android, iOS)',
      (yargs) => {
        yargs
          .options({
            host: {
              describe: 'Set the server host',
              type: 'string',
              default: 'localhost',
            },
            port: {
              describe: 'Set the server port',
              type: 'number',
              default: 8081,
            },
            ...commonOptions,
            // dummy options
            watchFolders: {
              describe: 'no-op',
              type: 'array',
            },
            assetPlugins: {
              describe: 'no-op',
              type: 'array',
            },
            sourceExts: {
              describe: 'no-op',
              type: 'array',
            },
            'max-workers': {
              describe: 'no-op',
              type: 'number',
            },
            transformer: {
              describe: 'no-op',
              type: 'string',
            },
          })
          .strictOptions()
          .version(false)
          .help();
      },
    )
    .command('serve', 'Start the development server for Web', (yargs) => {
      yargs
        .options({
          'entry-file': {
            type: 'string',
            describe: 'Set the entry file path',
            default: DEFAULT_WEB_ENTRY_POINT,
          },
          host: {
            describe: 'Set the server host',
            type: 'string',
            default: 'localhost',
          },
          port: {
            describe: 'Set the server port',
            type: 'number',
            default: 8081,
          },
          template: {
            describe: 'Set the template html',
            type: 'string',
          },
          dev: {
            type: 'boolean',
            describe: 'Set as development environment',
            default: true,
          },
          minify: {
            describe: 'Enable minify',
            type: 'boolean',
          },
          ...commonOptions,
        })
        .strictOptions()
        .version(false)
        .help();
    })
    .command(
      'bundle',
      'Build the bundle for the provided JavaScript entry file',
      (yargs) => {
        yargs
          .options({
            platform: {
              type: 'string',
              describe: 'Set the target platform for resolve modules',
              choices: ['android', 'ios', 'web'],
            },
            'entry-file': {
              type: 'string',
              describe: 'Set the entry file path',
              default: DEFAULT_ENTRY_POINT,
            },
            'bundle-output': {
              type: 'string',
              describe: 'Specify the path to store the resulting bundle',
            },
            'sourcemap-output': {
              type: 'string',
              describe:
                'Specify the path to store the source map file for the resulting bundle',
            },
            'assets-dest': {
              type: 'string',
              describe:
                'Specify the directory path for storing assets referenced in the bundle',
            },
            dev: {
              type: 'boolean',
              describe: 'Set as development environment',
              default: true,
            },
            minify: {
              describe: 'Enable minify',
              type: 'boolean',
              default: false,
            },
            metafile: {
              describe: 'Export Esbuild metafile to working directory',
              type: 'boolean',
              default: false,
            },
            ...commonOptions,
            // Dummy options.
            transformer: {
              describe: 'no-op',
              type: 'string',
            },
            'bundle-encoding': {
              describe: 'no-op',
              type: 'string',
            },
            'max-workers': {
              describe: 'no-op',
              type: 'number',
            },
            'sourcemap-sources-root': {
              describe: 'no-op',
              type: 'string',
            },
            'sourcemap-use-absolute-path': {
              describe: 'no-op',
              type: 'boolean',
            },
            'unstable-transform-profile': {
              describe: 'no-op',
              type: 'string',
            },
            'asset-catalog-dest': {
              describe: 'no-op',
              type: 'string',
            },
            'read-global-cache': {
              describe: 'no-op',
              type: 'boolean',
            },
            config: {
              describe: 'no-op',
              type: 'string',
            },
            'generate-static-view-configs': {
              describe: 'no-op',
              type: 'boolean',
            },
          })
          .demandOption(['bundle-output', 'platform'])
          .strictOptions()
          .version(false)
          .help();
      },
    )
    .command('ram-bundle', '')
    .command('cache', 'Cache utilities', (yargs) => {
      yargs
        .command('clean', 'Clear all transform cache')
        .demandCommand()
        .strictCommands()
        .version(false);
    })
    .demandCommand()
    .strictCommands()
    .help().argv;
};
