import { logger } from '../shared';

export const handleUncaughtException = (error: Error): boolean => {
  switch (true) {
    case error.message.includes('EADDRINUSE'):
      logger.error(error.message);
      return true;
  }

  return false;
};
