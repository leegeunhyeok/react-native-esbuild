import type { Server, MessageEvent, Data } from 'ws';
import type { HMRClientMessage, HMRMessage, HMRMessageType } from '../types';
import { HMRServer } from './HMRServer';

export class HMRAppServer extends HMRServer {
  private messageHandler?: (message: HMRClientMessage) => void;

  constructor() {
    super();
    this.setup((socket) => {
      socket.onmessage = this.handleMessage.bind(this);
    });
  }

  private parseClientMessage(data: Data): HMRClientMessage | null {
    try {
      const parsedData = JSON.parse(String(data));
      return 'type' in parsedData ? (parsedData as HMRClientMessage) : null;
    } catch (error) {
      return null;
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = this.parseClientMessage(event.data);
    if (!message) return;

    /**
     * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro/src/HMRServer.js#L200-L239}
     */
    this.messageHandler?.(message);
  }

  public getWebSocketServer(): Server {
    return this.server;
  }

  public setMessageHandler(handler: (message: HMRClientMessage) => void): void {
    this.messageHandler = handler;
  }

  public send<MessageType extends HMRMessageType>(
    type: MessageType,
    body: HMRMessage[MessageType],
  ): void {
    this.connectedSocket?.send(
      JSON.stringify({
        type,
        body,
      }),
    );
  }
}
