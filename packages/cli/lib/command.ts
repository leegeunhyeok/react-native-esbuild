import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { assertCommandOptions, getCommand } from './helpers';
import { VERSION } from './constants';
import type { Argv } from './types';

export function cli(): Argv | Promise<Argv> {
  return yargs(hideBin(process.argv))
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
          entry: {
            type: 'string',
            describe: 'entry file path',
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
          dev: {
            describe: 'set to develop environment',
            type: 'boolean',
          },
          minify: {
            describe: 'enable minify',
            type: 'boolean',
          },
        })
        .demandOption(['entry', 'destination', 'platform', 'dev'])
        .version(false)
        .help();
    })
    .demandCommand()
    .strictCommands()
    .check((argv) => assertCommandOptions(getCommand(argv), argv))
    .help().argv;
}
