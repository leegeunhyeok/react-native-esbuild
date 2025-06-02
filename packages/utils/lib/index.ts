import colors from 'colors';
import { isCI, isTTY } from './env';

(isCI() || !isTTY()) && colors.disable();

export { default as colors } from 'colors';
export * from './env';
export { Logger, LogLevel } from './logger';
