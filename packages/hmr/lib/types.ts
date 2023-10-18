/* eslint-disable no-var -- allow */
declare global {
  // react-native
  var __DEV__: boolean;

  // react-refresh/runtime
  var $RefreshRuntime$: {
    register: (type: unknown, id: string) => void;
    getSignature: () => (
      type: unknown,
      id: string,
      forceReset?: boolean,
      getCustomHooks?: () => unknown[],
    ) => void;
    performReactRefresh: () => void;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow
  var window: any;
}

/**
 * HMR web socket messages
 * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/types.flow.js#L68}
 */
export type HmrClientMessage =
  | RegisterEntryPointsMessage
  | LogMessage
  | LogOptInMessage;

export interface RegisterEntryPointsMessage {
  type: 'register-entrypoints';
  entryPoints: string[];
}

export interface LogMessage {
  type: 'log';
  level:
    | 'trace'
    | 'info'
    | 'warn'
    | 'log'
    | 'group'
    | 'groupCollapsed'
    | 'groupEnd'
    | 'debug';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- follow metro types
  data: any[];
  mode: 'BRIDGE' | 'NOBRIDGE';
}

export interface LogOptInMessage {
  type: 'log-opt-in';
}

/**
 * HMR update message
 * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro-runtime/src/modules/types.flow.js#L44-L56}
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- allow type
export type HmrMessage = {
  update: HmrUpdate;
  'update-start': {
    isInitialUpdate: boolean;
  };
  'update-done': undefined;
};

export type HmrMessageType = keyof HmrMessage;

export interface HmrUpdate {
  readonly added: HmrModule[];
  readonly deleted: number[];
  readonly modified: HmrModule[];
  isInitialUpdate: boolean;
  revisionId: string;
}

export interface HmrModule {
  module: [number, string];
  sourceMappingURL: string | null;
  sourceURL: string | null;
}
