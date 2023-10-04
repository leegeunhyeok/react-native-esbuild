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

const LABEL = ' » Esbuild ';
const DESCRIPTION = 'An extremely fast bundler';

export const printLogo = (): void => {
  if (isTTY()) {
    process.stdout.write(`${colors.yellow(LOGO)}\n`);
    process.stdout.write(
      [
        colors.bgYellow(colors.black(LABEL)),
        colors.gray(DESCRIPTION),
        '\n',
      ].join(' '),
    );
  } else {
    process.stdout.write(`Esbuild - ${DESCRIPTION}\n`);
  }
};

export const printVersion = (): void => {
  const paddingForCenterAlign = new Array(
    Math.floor(18 - pkg.version.length / 2),
  )
    .fill(' ')
    .join('');
  process.stdout.write(
    `${isTTY() ? paddingForCenterAlign : ''}v${pkg.version}\n\n`,
  );
};
