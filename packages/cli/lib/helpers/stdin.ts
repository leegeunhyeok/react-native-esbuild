import readline from 'node:readline';
import { logger } from '../shared';

export const enableInteractiveMode = (
  onKeypress?: (keyName: string) => void,
): boolean => {
  if (
    !(process.stdin.isTTY && typeof process.stdin.setRawMode === 'function')
  ) {
    logger.debug('interactive mode is not supported in this environment');
    return false;
  }

  /**
   * @see {@link https://nodejs.org/api/tty.html#readstreamsetrawmodemode}
   */
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');
  process.stdin.on(
    'keypress',
    (_data, key: { ctrl: boolean; name: string }) => {
      const { ctrl, name } = key;

      // shortcuts
      if (ctrl) {
        switch (name) {
          // Ctrl + C: SIGINT
          case 'c':
            process.exit(0);
            break;

          // Ctrl + Z: SIGTSTP
          case 'z':
            process.emit('SIGTSTP', 'SIGTSTP');
            break;
        }
        return;
      }

      onKeypress?.(name);
    },
  );

  return true;
};
