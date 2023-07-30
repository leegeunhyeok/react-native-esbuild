import http, { type Server as HTTPServer } from 'node:http';
import type { Server as WebSocketServer } from 'ws';
import {
  createDevServerMiddleware,
  indexPageMiddleware,
} from '@react-native-community/cli-server-api';
import {
  ReactNativeEsbuildBundler,
  type BundlerConfig,
} from '@react-native-esbuild/core';
import {
  createServeAssetMiddleware,
  createServeBundleMiddleware,
  createSymbolicateMiddleware,
} from '../middlewares';
import { DEFAULT_PORT, DEFAULT_HOST } from '../constants';
import type { DevServerMiddlewareContext, DevServerOptions } from '../types';

export class ReactNativeEsbuildDevServer {
  private bundler?: ReactNativeEsbuildBundler;
  private server?: HTTPServer;
  private devServerOptions: Required<DevServerOptions>;

  constructor(devServerOptions: DevServerOptions) {
    this.devServerOptions = {
      port: devServerOptions.port ?? DEFAULT_PORT,
      host: devServerOptions.host ?? DEFAULT_HOST,
    };
  }

  private assertBundler(
    bundler?: ReactNativeEsbuildBundler,
  ): asserts bundler is ReactNativeEsbuildBundler {
    if (!bundler) {
      throw new Error('bundler is not ready');
    }
  }

  private assertHTTPServer(
    httpServer?: HTTPServer,
  ): asserts httpServer is HTTPServer {
    if (!httpServer) {
      throw new Error('http server is not ready');
    }
  }

  initialize(bundlerConfig: BundlerConfig): this {
    this.bundler = new ReactNativeEsbuildBundler(bundlerConfig);

    const context: DevServerMiddlewareContext = {
      bundler: this.bundler,
      devServerOptions: this.devServerOptions,
    };

    const { middleware, websocketEndpoints } = createDevServerMiddleware({
      port: this.devServerOptions.port,
      host: this.devServerOptions.host,
      watchFolders: [],
    });

    middleware.use(createServeAssetMiddleware(context));
    middleware.use(createServeBundleMiddleware(context));
    middleware.use(createSymbolicateMiddleware(context));
    middleware.use(indexPageMiddleware);

    this.server = http.createServer(middleware);

    this.server.on('upgrade', (request, socket, head) => {
      if (!request.url) return;

      const pathname = new URL(request.url).pathname;
      const handler = websocketEndpoints[pathname] as
        | WebSocketServer
        | undefined;

      if (pathname === '/hot') {
        // TODO: add live reload
        console.warn('HRM is not supported');
        socket.destroy();
      } else if (handler) {
        handler.handleUpgrade(request, socket, head, (client) => {
          handler.emit('connection', client, request);
        });
      } else {
        socket.destroy();
      }
    });

    return this;
  }

  listen(): HTTPServer {
    this.assertBundler(this.bundler);
    this.assertHTTPServer(this.server);

    return this.server.listen(this.devServerOptions, () => {
      console.log(`dev server listening on ${this.devServerOptions.port}`);
    });
  }
}
