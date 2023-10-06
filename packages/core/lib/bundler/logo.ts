import { colors, isTTY } from '@react-native-esbuild/utils';
import pkg from '../../package.json';

const LOGO = `
           "88e   "88e
             "88e   "88e
               "88e   "88e
               e88"   e88"
             e88"   e88"
           e88"   e88"
`;

// center column of `LOGO`
const LOGO_CENTER_X = 18;

export const ESBUILD_LABEL = ' » esbuild ';
const DESCRIPTION = 'An extremely fast bundler';

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
    Math.floor(LOGO_CENTER_X - pkg.version.length / 2),
  )
    .fill(' ')
    .join('');
  process.stdout.write(
    `${isTTY() ? paddingForCenterAlign : ''}v${pkg.version}\n\n`,
  );
};
