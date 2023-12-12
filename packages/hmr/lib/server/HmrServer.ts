import { Server, type WebSocket } from 'ws';
import { logger } from '../shared';
import type { HmrMessage, HmrMessageType } from '../types';

export abstract class HmrServer {
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

  public abstract send<MessageType extends HmrMessageType>(
    type: MessageType,
    body: HmrMessage[MessageType],
  ): void;
}
