import { Server, type WebSocket } from 'ws';
import { logger } from '../shared';
import type { HMRMessage, HMRMessageType } from '../types';

export abstract class HMRServer {
  protected server: Server;
  protected connectedSocket?: WebSocket;

  constructor() {
    this.server = new Server({ noServer: true });
  }

  private handleClose(): void {
    this.connectedSocket = undefined;
    logger.debug('HMR web socket was closed');
  }

  public setup(onConnect?: (socket: WebSocket) => void): void {
    this.server.on('connection', (socket) => {
      this.connectedSocket = socket;
      this.connectedSocket.onclose = this.handleClose.bind(this);
      this.connectedSocket.onerror = this.handleClose.bind(this);
      logger.debug('HMR web socket was connected');
      onConnect?.(socket);
    });

    this.server.on('error', (error) => {
      logger.error('HMR web socket server error', error);
    });
  }

  public getWebSocketServer(): Server {
    return this.server;
  }

  public abstract send<MessageType extends HMRMessageType>(
    type: MessageType,
    body: HMRMessage[MessageType],
  ): void;
}
