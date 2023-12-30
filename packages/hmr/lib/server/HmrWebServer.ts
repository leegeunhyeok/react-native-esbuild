import type { HMRMessage, HMRMessageType } from '../types';
import { HMRServer } from './HMRServer';

export class HMRWebServer extends HMRServer {
  constructor() {
    super();
    this.setup();
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
