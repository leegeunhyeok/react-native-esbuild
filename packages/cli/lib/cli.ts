import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { VERSION } from './constants';
import type { Argv } from './types';

const commonOptions = {
  verbose: {
    describe: 'print all logs',
    type: 'boolean',
    default: false,
  },
  timestamp: {
    describe: 'print timestamp in log',
    type: 'boolean',
    default: false,
  },
  'reset-cache': {
    describe: 'reset transform cache',
    type: 'boolean',
    default: false,
  },
} as const;

export function cli(): Argv | Promise<Argv> {
  return yargs(hideBin(process.argv))
    .scriptName('rne')
    .version(VERSION)
    .usage('$0 <cmd> [args]')
    .command('start', 'start bundler with dev server', (yargs) => {
      yargs
        .options({
          'entry-file': {
            type: 'string',
            describe: 'entry file path',
          },
          host: {
            describe: 'dev server host',
            type: 'string',
            default: 'localhost',
          },
          port: {
            describe: 'dev server port',
            type: 'number',
            default: 8081,
          },
          ...commonOptions,
        })
        .version(false)
        .help();
    })
    .command('bundle', 'bundle your application', (yargs) => {
      yargs
        .options({
          platform: {
            type: 'string',
            describe: 'platform for resolve modules',
            choices: ['android', 'ios', 'web'],
          },
          'entry-file': {
            type: 'string',
            describe: 'entry file path',
          },
          'bundle-output': {
            type: 'string',
            describe: 'bundle output file destination',
          },
          'sourcemap-output': {
            type: 'string',
            describe: 'sourcemap file destination',
          },
          'assets-dest': {
            type: 'string',
            describe: 'assets directory',
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
            describe: 'make metafile.json file for esbuild analyze',
            type: 'boolean',
            default: false,
          },
          ...commonOptions,
        })
        .demandOption(['bundle-output', 'platform'])
        .version(false)
        .help();
    })
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
}
