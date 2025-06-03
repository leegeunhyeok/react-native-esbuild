declare module 'metro-inspector-proxy' {
  import type { WebSocketServer } from 'ws';

  class InspectorProxy {
    constructor(projectRoot: string);

    /**
     * Process HTTP request sent to server. We only respond to 2 HTTP requests:
     * 1. /json/version returns Chrome debugger protocol version that we use
     * 2. /json and /json/list returns list of page descriptions (list of inspectable apps).
     * This list is combined from all the connected devices.
     */
    processRequest: (
      request: IncomingMessage,
      response: ServerResponse,
      next: (error?: Error) => void,
    ) => void;

    /**
     * Adds websocket listeners to the provided HTTP/HTTPS server.
     */
    createWebSocketListeners: (server: HTTPServer) => {
      ['/inspector/device']: WebSocketServer;
      ['/inspector/debug']: WebSocketServer;
    };
  }

  export { InspectorProxy };
}

declare module 'http' {
  interface IncomingMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allow any.
    rawBody: any;
  }
}
