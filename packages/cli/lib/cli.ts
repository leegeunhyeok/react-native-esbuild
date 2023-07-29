import yargs from 'yargs';
import * as helpers from 'yargs/helpers';
import { VERSION } from './constants';
import { assertCommandOptions, getCommand } from './helpers';

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
        },
      })
      .demandOption(['dev', 'destination'])
      .version(false)
      .help();
  })
  .demandCommand()
  .strictCommands()
  .check((argv) => assertCommandOptions(getCommand(argv), argv))
  .help().argv;

Promise.resolve(argv).then(async (argv): Promise<void> => {
  // TODO
  switch (getCommand(argv)) {
    case 'start':
      await Promise.resolve();
      break;

    case 'build':
      await Promise.resolve();
      break;
  }
});
