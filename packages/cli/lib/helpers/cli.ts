import { colors } from '@react-native-esbuild/utils';
import { logger } from '../shared';

export const getCommand = <RawArgv extends { _: (string | number)[] }>(
  argv: RawArgv,
  position = 0,
): string => argv._[position].toString();

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
export const printDebugOptions = <T extends Record<string, any>>(
  options: T,
): void => {
  Object.entries(options).forEach(([key, value], index, entries) => {
    const isLast = entries.length - 1 === index;
    const pipe = `${isLast ? '╰' : '├'}─`;
    const keyValue = `${key}: ${JSON.stringify(value)}`;
    logger.debug(colors.gray(`${pipe} ${keyValue}${isLast ? '\n' : ''}`));
  });
};
