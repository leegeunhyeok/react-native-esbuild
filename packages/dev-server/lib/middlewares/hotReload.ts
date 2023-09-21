import { Server, type WebSocket, type MessageEvent, type Data } from 'ws';
import { clientLogger, logger } from '../shared';
import { convertHmrLogLevel } from '../helpers';
import type {
  HotReloadMiddleware,
  HmrClientMessage,
  HmrUpdateDoneMessage,
  HmrUpdateMessage,
  HmrUpdateStartMessage,
  ReportableEvent,
} from '../types';

const getMessage = (data: Data): HmrClientMessage | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- from ws data
    const parsedData = JSON.parse(String(data));
    return 'type' in parsedData ? (parsedData as HmrClientMessage) : null;
  } catch (error) {
    return null;
  }
};

export const createHotReloadMiddleware = (
  reporter?: (event: ReportableEvent) => void,
): HotReloadMiddleware => {
  const server = new Server({ noServer: true });
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
        const level = convertHmrLogLevel(message.level);
        clientLogger[level](message.data.join(' '));

        // TODO: manage reporter in core
        reporter?.({
          type: 'client_log',
          level,
          data: message.data,
          mode: 'BRIDGE',
        });
        break;
      }

      // not supported
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
   * inject reload code to application
   *
   * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/HMRClient.js#L91-L99}
   * @see [turboModuleProxy]{@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/TurboModule/TurboModuleRegistry.js#L17}
   * @see [nativeModuleProxy]{@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/BatchedBridge/NativeModules.js#L179}
   */
  const hotReload = (revisionId: string): void => {
    const hmrUpdateMessage: HmrUpdateMessage = {
      type: 'update',
      body: {
        added: [
          {
            /**
             * ```ts
             * // it works the same as the code below
             * import { DevSettings } from 'react-native';
             *
             * DevSettings.reload();
             * ```
             */
            module: [
              -1,
              '(global.__turboModuleProxy || global.nativeModuleProxy)["DevSettings"].reload();',
            ],
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
      body: {
        isInitialUpdate: false,
      },
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

  return { server, hotReload, updateStart, updateDone };
};
