declare global {
  // eslint-disable-next-line no-var
  var self: Global & {
    logEnabled?: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export {};
