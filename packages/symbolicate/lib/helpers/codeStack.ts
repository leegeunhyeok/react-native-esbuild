import type { IncomingMessage } from 'node:http';
import type { Frame } from '../types';

export const parseStackFromRawBody = (
  rawBody: IncomingMessage['rawBody'],
): Frame[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- `rawBody` is any type.
  const parsedStack = JSON.parse(rawBody) as { stack: Frame[] };
  return parsedStack.stack;
};
