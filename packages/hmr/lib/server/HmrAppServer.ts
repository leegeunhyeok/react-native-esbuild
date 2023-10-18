import type { Server, MessageEvent, Data } from 'ws';
import type { HmrClientMessage, HmrMessage, HmrMessageType } from '../types';
import { HmrServer } from './HmrServer';

export class HmrAppServer extends HmrServer {
  private messageHandler?: (message: HmrClientMessage) => void;

  constructor() {
    super();
    this.setup((socket) => {
      socket.onmessage = this.handleMessage.bind(this);
    });
  }

  private parseClientMessage(data: Data): HmrClientMessage | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- from ws data
      const parsedData = JSON.parse(String(data));
      return 'type' in parsedData ? (parsedData as HmrClientMessage) : null;
    } catch (error) {
      return null;
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = this.parseClientMessage(event.data);
    if (!message) return;

    /**
     * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro/src/HmrServer.js#L200-L239}
     */
    this.messageHandler?.(message);
  }

  public getWebSocketServer(): Server {
    return this.server;
  }

  public setMessageHandler(handler: (message: HmrClientMessage) => void): void {
    this.messageHandler = handler;
  }

  public send<MessageType extends HmrMessageType>(
    type: MessageType,
    body: HmrMessage[MessageType],
  ): void {
    this.connectedSocket?.send(
      JSON.stringify({
        type,
        body,
      }),
    );
  }
}
