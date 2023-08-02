import { colors } from '@react-native-esbuild/utils';

const LOGO = `
           "88e   "88e
             "88e   "88e
               "88e   "88e
               e88"   e88"
             e88"   e88"
           e88"   e88"
`;

const LABEL = ' » ESBuild ';
const DESCRIPTION = 'An extremely fast bundler + React Native';

export const printLogo = (): void => {
  process.stdout.write(`${colors.yellow(LOGO)}\n`);
  process.stdout.write(
    [colors.bgYellow(colors.black(LABEL)), colors.gray(DESCRIPTION), '\n'].join(
      ' ',
    ),
  );
};
