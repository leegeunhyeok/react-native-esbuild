import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import type { HMRServer } from '@react-native-esbuild/hmr';

export enum BundleRequestType {
  Unknown,
  Bundle,
  Sourcemap,
}

export interface DevServerOptions {
  root?: string;
  port?: number;
  host?: string;
}

export interface DevServerMiddlewareContext {
  devServerOptions: DevServerOptions;
  bundler: ReactNativeEsbuildBundler;
}

export type DevServerMiddlewareCreator<MiddlewareOptions = void> = (
  context: DevServerMiddlewareContext,
  options?: MiddlewareOptions,
) => DevServerMiddleware;

export type DevServerMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: (error?: unknown) => void,
) => void;

export interface HMRMiddleware {
  server: HMRServer;
  updateStart: () => void;
  updateDone: () => void;
  hotReload: (revisionId: string, code: string) => void;
  liveReload: (revisionId: string) => void;
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Following metro's type definition.
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

export type SerializableData = string | Buffer | Uint8Array;
