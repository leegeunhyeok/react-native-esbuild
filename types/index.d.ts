declare global {
  // eslint-disable-next-line no-var
  var self: Global & {
    logEnabled?: boolean;
    logLevel: 'debug' | 'log' | 'info' | 'warn' | 'error';
  };
}

declare module 'http' {
  interface IncomingMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawBody: any;
  }
}

export {};
