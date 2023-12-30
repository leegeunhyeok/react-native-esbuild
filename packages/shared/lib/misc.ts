import * as colors from 'colors';
import { isTTY } from './utils';

const LOGO = `
           "88e   "88e
             "88e   "88e
               "88e   "88e
               e88"   e88"
             e88"   e88"
           e88"   e88"
`;

// Center column index of `LOGO`
const LOGO_CENTER_X = 18;

const DESCRIPTION = 'An extremely fast bundler';

export const ESBUILD_LABEL = ' » esbuild ';

export const printLogo = (): void => {
  if (isTTY()) {
    process.stdout.write(`${colors.yellow(LOGO)}\n`);
    process.stdout.write(
      [
        colors.bgYellow(colors.black(ESBUILD_LABEL)),
        colors.gray(DESCRIPTION),
        '\n',
      ].join(' '),
    );
  } else {
    process.stdout.write(`${ESBUILD_LABEL.trim()} - ${DESCRIPTION}\n`);
  }
};

export const printVersion = (): void => {
  const paddingForCenterAlign = new Array(
    Math.floor(LOGO_CENTER_X - (self._version as string).length / 2),
  )
    .fill(' ')
    .join('');
  process.stdout.write(
    `${isTTY() ? paddingForCenterAlign : ''}v${self._version}\n\n`,
  );
};
