import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { VERSION } from './constants';
import type { RawArgv } from './types';

const commonOptions = {
  verbose: {
    describe: 'print all logs',
    type: 'boolean',
    default: false,
  },
  'reset-cache': {
    describe: 'reset transform cache',
    type: 'boolean',
    default: false,
  },
} as const;

export const cli = (): RawArgv | Promise<RawArgv> => {
  return yargs(hideBin(process.argv))
    .scriptName('rne')
    .version(VERSION)
    .usage('$0 <cmd> [args]')
    .command('start', 'start bundler with dev server', (yargs) => {
      yargs
        .options({
          host: {
            describe: 'set the server host',
            type: 'string',
            default: 'localhost',
          },
          port: {
            describe: 'set the server port',
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
    })
    .command('bundle', 'bundle your application', (yargs) => {
      yargs
        .options({
          platform: {
            type: 'string',
            describe: 'set the target platform for resolve modules',
            choices: ['android', 'ios', 'web'],
          },
          'entry-file': {
            type: 'string',
            describe: 'set the entry file path',
          },
          'bundle-output': {
            type: 'string',
            describe: 'specify the path to store the resulting bundle',
          },
          'sourcemap-output': {
            type: 'string',
            describe:
              'specify the path to store the source map file for the resulting bundle',
          },
          'assets-dest': {
            type: 'string',
            describe:
              'specify the directory path for storing assets referenced in the bundle',
          },
          dev: {
            type: 'boolean',
            describe: 'set as development environment',
            default: true,
          },
          minify: {
            describe: 'enable minify',
            type: 'boolean',
          },
          metafile: {
            describe: 'export Esbuild metafile to working directory',
            type: 'boolean',
            default: false,
          },
          ...commonOptions,
          // dummy options
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
    })
    .command('ram-bundle', '')
    .command('cache', 'manage transform cache', (yargs) => {
      yargs
        .command('clean', 'clear all transform cache')
        .demandCommand()
        .strictCommands()
        .version(false);
    })
    .demandCommand()
    .strictCommands()
    .help().argv;
};
