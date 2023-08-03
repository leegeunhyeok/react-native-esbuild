import { Server, type WebSocket, type MessageEvent, type Data } from 'ws';
import { clientLogger } from '../shared';
import { convertHmrLogLevel } from '../helpers';
import type { HmrClientMessage, HotReloadMiddleware } from '../types';

const getMessage = (data: Data): HmrClientMessage | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedData = JSON.parse(String(data));
    return 'type' in parsedData ? (parsedData as HmrClientMessage) : null;
  } catch (error) {
    return null;
  }
};

export const createHotReloadMiddleware = (): HotReloadMiddleware => {
  const server = new Server({ noServer: true });
  let connectedSocket: WebSocket | null = null;

  const handleClose = (): void => {
    connectedSocket = null;
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        clientLogger[level](message.data.join(' '));
        break;
      }

      // not supported
      case 'register-entrypoints':
      case 'log-opt-in':
        break;
    }
  };

  server.on('connection', (socket) => {
    connectedSocket = socket;
    connectedSocket.onerror = handleClose;
    connectedSocket.onclose = handleClose;
    connectedSocket.onmessage = handleMessage;
  });

  return { server };
};
