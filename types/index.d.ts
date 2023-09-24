declare global {
  // eslint-disable-next-line no-var -- allow
  var self: Global & {
    // core config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
    _config: any; // BundlerConfig in @react-native-esbuild/core
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
