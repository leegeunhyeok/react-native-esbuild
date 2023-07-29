import type { IncomingMessage, ServerResponse } from 'node:http';
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
