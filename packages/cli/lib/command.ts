import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { VERSION } from './constants';
import type { Argv } from './types';

const commonOptions = {
  debug: {
    describe: 'show cli debug log',
    type: 'boolean',
    default: false,
  },
  resetCache: {
    alias: 'reset-cache',
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
          entry: {
            type: 'string',
            describe: 'entry file path',
          },
          host: {
            describe: 'dev server host',
            type: 'string',
            default: '127.0.0.1',
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
    .command('build', 'bundle your application', (yargs) => {
      yargs
        .options({
          entry: {
            type: 'string',
            describe: 'entry file path',
          },
          platform: {
            type: 'string',
            describe: 'platform for resolve modules',
            choices: ['android', 'ios', 'web'],
          },
          output: {
            type: 'string',
            describe: 'bundle output file destination',
          },
          assets: {
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
          ...commonOptions,
        })
        .demandOption(['output', 'platform'])
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
