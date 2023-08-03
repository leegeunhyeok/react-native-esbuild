import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Server } from 'ws';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

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
  server: Server;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  mode: 'BRIDGE' | 'NOBRIDGE';
}

export interface LogOptInMessage {
  type: 'log-opt-in';
}
