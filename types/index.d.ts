declare global {
  // eslint-disable-next-line no-var -- Allow var.
  var self: Global & {
    // core config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `BundlerConfig` in @react-native-esbuild/core.
    _config: any;
    // logger
    logEnabled: boolean;
    logLevel: number;
    logTimestampFormat: string | null;
  };
}

declare module 'http' {
  interface IncomingMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allow any.
    rawBody: any;
  }
}

export {};
