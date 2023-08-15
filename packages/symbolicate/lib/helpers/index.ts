import type { IncomingMessage } from 'node:http';
import type { Frame } from '../types';

export const parseStackFromRawBody = (
  rawBody: IncomingMessage['rawBody'],
): Frame[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const parsedStack = JSON.parse(rawBody) as { stack: Frame[] };
  return parsedStack.stack;
};
