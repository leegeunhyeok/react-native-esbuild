declare global {
  // eslint-disable-next-line no-var -- allow
  var self: Global & {
    // core config
    cache: boolean;
    // logger
    logEnabled?: boolean;
    logLevel: 'debug' | 'log' | 'info' | 'warn' | 'error';
    timestampEnabled: boolean;
  };
}

declare module 'http' {
  interface IncomingMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
    rawBody: any;
  }
}

export {};
