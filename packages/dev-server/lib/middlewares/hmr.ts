import {
  HMRAppServer,
  HMRWebServer,
  type HMRClientMessage,
} from '@react-native-esbuild/hmr';
import { getReloadByDevSettingsProxy } from '@react-native-esbuild/internal';
import type { HMRMiddleware } from '../types';
import { logger } from '../shared';

export const createHMRMiddlewareForApp = ({
  onMessage,
}: {
  onMessage?: (event: HMRClientMessage) => void;
}): HMRMiddleware => {
  const server = new HMRAppServer();

  server.setMessageHandler((event) => onMessage?.(event));

  const updateStart = (): void => {
    logger.debug('send update-start message');
    server.send('update-start', { isInitialUpdate: false });
  };

  const updateDone = (): void => {
    logger.debug('send update-done message');
    server.send('update-done', undefined);
  };

  const hotReload = (revisionId: string, code: string): void => {
    logger.debug('send update message (hmr)');
    server.send('update', {
      added: [
        {
          module: [-1, code],
          sourceMappingURL: null,
          sourceURL: null,
        },
      ],
      deleted: [],
      modified: [],
      isInitialUpdate: false,
      revisionId,
    });
  };

  const liveReload = (revisionId: string): void => {
    logger.debug('send update message (live reload)');
    server.send('update', {
      added: [
        {
          module: [-1, getReloadByDevSettingsProxy()],
          sourceMappingURL: null,
          sourceURL: null,
        },
      ],
      deleted: [],
      modified: [],
      isInitialUpdate: false,
      revisionId,
    });
  };

  return { server, updateStart, updateDone, hotReload, liveReload };
};

export const createHMRMiddlewareForWeb = (): HMRMiddleware => {
  const server = new HMRWebServer();

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- noop
  const noop = (): void => {};

  return {
    server,
    updateStart: noop,
    updateDone: noop,
    hotReload: (_revisionId: string, _code: string): void => {
      logger.debug('send update message (hmr)');
      // TODO
      // server.send('update', {
      //   added: [
      //     {
      //       module: [-1, code],
      //       sourceMappingURL: null,
      //       sourceURL: null,
      //     },
      //   ],
      //   deleted: [],
      //   modified: [],
      //   isInitialUpdate: false,
      //   revisionId,
      // });
    },
    liveReload: (_revisionId: string): void => {
      logger.debug('send update message (live reload)');
      // TODO
      // server.send('update', {
      //   added: [
      //     {
      //       module: [-1, 'window.location.reload();'],
      //       sourceMappingURL: null,
      //       sourceURL: null,
      //     },
      //   ],
      //   deleted: [],
      //   modified: [],
      //   isInitialUpdate: false,
      //   revisionId,
      // });
    },
  };
};
