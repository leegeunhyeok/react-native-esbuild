import {
  WebSocketServer,
  type WebSocket,
  type MessageEvent,
  type Data,
} from 'ws';
import type { ClientLogEvent } from '@react-native-esbuild/core';
import { getReloadByDevSettingsProxy } from '@react-native-esbuild/internal';
import { logger } from '../shared';
import type {
  HotReloadMiddleware,
  HmrClientMessage,
  HmrUpdateDoneMessage,
  HmrUpdateMessage,
  HmrUpdateStartMessage,
} from '../types';

const getMessage = (data: Data): HmrClientMessage | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Web socket data.
    const parsedData = JSON.parse(String(data));
    return 'type' in parsedData ? (parsedData as HmrClientMessage) : null;
  } catch (error) {
    return null;
  }
};

export const createHotReloadMiddleware = ({
  onLog,
}: {
  onLog?: (event: ClientLogEvent) => void;
}): HotReloadMiddleware => {
  const server = new WebSocketServer({ noServer: true });
  let connectedSocket: WebSocket | null = null;

  const handleClose = (): void => {
    connectedSocket = null;
    logger.debug('HMR web socket was closed');
  };

  const handleMessage = (event: MessageEvent): void => {
    const message = getMessage(event.data);
    if (!message) return;

    /**
     * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro/src/HmrServer.js#L200-L239}
     */
    switch (message.type) {
      case 'log': {
        onLog?.({
          type: 'client_log',
          level: message.level,
          data: message.data,
          mode: 'BRIDGE',
        });
        break;
      }

      // Not supported
      case 'register-entrypoints':
      case 'log-opt-in':
        break;
    }
  };

  const handleError = (error?: Error): void => {
    if (error) {
      logger.error('unable to send HMR update message', error);
    }
  };

  /**
   * Send reload code to client.
   *
   * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/HMRClient.js#L91-L99}
   */
  const hotReload = (revisionId: string): void => {
    const hmrUpdateMessage: HmrUpdateMessage = {
      type: 'update',
      body: {
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
      },
    };

    logger.debug('sending update message with reload code');
    connectedSocket?.send(JSON.stringify(hmrUpdateMessage), handleError);
  };

  const updateStart = (): void => {
    logger.debug('sending update-start');
    const hmrUpdateStartMessage: HmrUpdateStartMessage = {
      type: 'update-start',
      body: { isInitialUpdate: false },
    };
    connectedSocket?.send(JSON.stringify(hmrUpdateStartMessage), handleError);
  };

  const updateDone = (): void => {
    logger.debug('sending update-done');
    const hmrUpdateDoneMessage: HmrUpdateDoneMessage = { type: 'update-done' };
    connectedSocket?.send(JSON.stringify(hmrUpdateDoneMessage), handleError);
  };

  server.on('connection', (socket) => {
    connectedSocket = socket;
    connectedSocket.onerror = handleClose;
    connectedSocket.onclose = handleClose;
    connectedSocket.onmessage = handleMessage;
    logger.debug('HMR web socket was connected');
  });

  server.on('error', (error) => {
    logger.error('HMR web socket server error', error);
  });

  return { server, hotReload, updateStart, updateDone };
};
