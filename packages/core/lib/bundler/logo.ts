import { colors, isTTY } from '@react-native-esbuild/utils';

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
