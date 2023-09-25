import type {
  Server as HTTPServer,
  IncomingMessage,
  ServerResponse,
} from 'node:http';
import type { Server as WebSocketServer } from 'ws';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

export enum BundleRequestType {
  Unknown,
  Bundle,
  Sourcemap,
}

export interface DevServerOptions {
  port?: number;
  host?: string;
}

export interface DevServerMiddlewareContext {
  devServerOptions: DevServerOptions;
  bundler: ReactNativeEsbuildBundler;
}

export type DevServerMiddlewareCreator = (
  context: DevServerMiddlewareContext,
) => DevServerMiddleware;

export type DevServerMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: (error?: unknown) => void,
) => void;

export interface HotReloadMiddleware {
  server: WebSocketServer;
  hotReload: (revisionId: string) => void;
  updateStart: () => void;
  updateDone: () => void;
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
export type HmrMessage =
  | HmrUpdateMessage
  | HmrUpdateStartMessage
  | HmrUpdateDoneMessage;

export interface HmrUpdateMessage {
  type: 'update';
  body: HmrUpdate;
}
export interface HmrUpdateStartMessage {
  type: 'update-start';
  body: {
    isInitialUpdate: boolean;
  };
}

export interface HmrUpdateDoneMessage {
  type: 'update-done';
}

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

/**
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.5/packages/cli-server-api/src/websocket/createEventsSocketEndpoint.ts#L18}
 * @see {@link https://github.com/react-native-community/cli/blob/v11.3.5/packages/cli-server-api/src/websocket/createEventsSocketEndpoint.ts#L179}
 */
export type BroadcastCommand = 'reload' | 'devMenu';

// TODO: convert to declare module 'metro-inspector-proxy' { ... }
export interface TypedInspectorProxy {
  (projectRoot: string): TypedInspectorProxy;

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
