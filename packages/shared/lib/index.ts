import colors from 'colors';
import { isCI, isTTY } from './utils';

(isCI() || !isTTY()) && colors.disable();

// Data, utilities, helpers
export * as colors from 'colors';
export * from './constants';
export * from './helpers';
export * from './misc';
export * from './utils';
export * from './enums';
export { Logger, LogLevel } from './logger';

// Shared types
export type * from './types/config';
export type * from './types/core';
export type * from './types/transformer';
