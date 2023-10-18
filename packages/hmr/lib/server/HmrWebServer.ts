import type { HmrMessage, HmrMessageType } from '../types';
import { HmrServer } from './HmrServer';

export class HmrWebServer extends HmrServer {
  constructor() {
    super();
    this.setup();
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
