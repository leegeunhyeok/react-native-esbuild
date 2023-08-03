import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { assertCommandOptions, getCommand } from './helpers';
import { VERSION } from './constants';
import type { Argv } from './types';

const commonOptions = {
  entry: {
    type: 'string',
    describe: 'entry file path',
    default: 'index.js',
  },
  assets: {
    type: 'string',
    describe: 'assets directory',
  },
  platform: {
    type: 'string',
    describe: 'platform for resolve modules',
    choices: ['android', 'ios', 'web'],
  },
  dev: {
    type: 'boolean',
    describe: 'set to develop environment',
    default: true,
  },
  minify: {
    describe: 'enable minify',
    type: 'boolean',
    default: false,
  },
  debug: {
    describe: 'show cli debug log',
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
          ...commonOptions,
          output: {
            type: 'string',
            describe: 'bundle file name',
            default: 'main.jsbundle',
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
        })
        .version(false)
        .help();
    })
    .command('build', 'bundle your application', (yargs) => {
      yargs
        .options({
          ...commonOptions,
          output: {
            type: 'string',
            describe: 'bundle file destination',
          },
        })
        .demandOption(['output', 'platform'])
        .version(false)
        .help();
    })
    .demandCommand()
    .strictCommands()
    .check((argv) => assertCommandOptions(getCommand(argv), argv))
    .help().argv;
}
