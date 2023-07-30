const LOGO = `
           "88e   "88e
             "88e   "88e
               "88e   "88e
               e88"   e88"
             e88"   e88"
           e88"   e88"
`;

const LABEL = ' » ESBuild ';
const DESCRIPTION = 'An extremely fast bundler';

export const printLogo = (): void => {
  console.log(LOGO.yellow);
  console.log(LABEL.black.bgYellow, DESCRIPTION.gray, '\n');
};
