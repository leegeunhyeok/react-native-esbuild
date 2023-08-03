declare global {
  // eslint-disable-next-line no-var
  var self: Global & {
    logEnabled?: boolean;
    logLevel: 'debug' | 'log' | 'info' | 'warn' | 'error';
  };
}

export {};
