import http, { type Server as HTTPServer } from 'node:http';
import { parse } from 'node:url';
import type { Server as WebSocketServer } from 'ws';
import {
  createDevServerMiddleware,
  indexPageMiddleware,
} from '@react-native-community/cli-server-api';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createHotReloadMiddleware,
  createServeAssetMiddleware,
  createServeBundleMiddleware,
  createSymbolicateMiddleware,
} from '../middlewares';
import { toSafetyMiddleware } from '../helpers';
import { logger } from '../shared';
import { DEFAULT_PORT, DEFAULT_HOST } from '../constants';
import type { DevServerMiddlewareContext, DevServerOptions } from '../types';

export class ReactNativeEsbuildDevServer {
  private initialized = false;
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

  initialize(): {
    server: ReactNativeEsbuildDevServer;
    bundler: ReactNativeEsbuildBundler;
  } {
    if (this.initialized && this.bundler) {
      logger.warn('dev server already initialized');
      return { server: this, bundler: this.bundler };
    }

    logger.debug('setup dev server', this.devServerOptions);
    logger.debug('create bundler instance');

    const { server: hotReloadServer, ...hr } = createHotReloadMiddleware();
    const { middleware, websocketEndpoints } = createDevServerMiddleware({
      port: this.devServerOptions.port,
      host: this.devServerOptions.host,
      watchFolders: [],
    });

    this.bundler = new ReactNativeEsbuildBundler();
    this.bundler.addListener('build-start', hr.updateStart);
    this.bundler.addListener('build-end', ({ revisionId }) => {
      hr.hotReload(revisionId);
      hr.updateDone();
    });

    const context: DevServerMiddlewareContext = {
      bundler: this.bundler,
      devServerOptions: this.devServerOptions,
    };

    logger.debug('setup middlewares');

    // middleware for http logging
    middleware.use((request, _response, next) => {
      if (request.method && request.url) {
        logger.debug(`[${request.method}] ${request.url}`, request.headers);
      }
      next();
    });

    [
      createServeAssetMiddleware(context),
      createServeBundleMiddleware(context),
      createSymbolicateMiddleware(context),
      indexPageMiddleware,
    ].forEach((m) => middleware.use(toSafetyMiddleware(m)));

    logger.debug('create http server');
    this.server = http.createServer(middleware);

    logger.debug('setup web socket');
    this.server.on('upgrade', (request, socket, head) => {
      if (!request.url) return;

      const { pathname } = parse(request.url);
      const handler = pathname
        ? (websocketEndpoints[pathname] as WebSocketServer)
        : null;

      /**
       * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro/src/index.flow.js#L230-L239}
       */
      if (pathname === '/hot') {
        logger.debug('HMR is not supported');
        hotReloadServer.handleUpgrade(request, socket, head, (client) => {
          hotReloadServer.emit('connection', client, request);
        });
      } else if (handler) {
        handler.handleUpgrade(request, socket, head, (client) => {
          handler.emit('connection', client, request);
        });
      } else {
        socket.destroy();
      }
    });

    return { server: this, bundler: this.bundler };
  }

  listen(): HTTPServer {
    this.assertBundler(this.bundler);
    this.assertHTTPServer(this.server);
    const { host, port } = this.devServerOptions;

    return this.server.listen(port, () => {
      process.stdout.write('\n');
      logger.info(`dev server listening on http://${host}:${port}`);
      process.stdout.write('\n');
    });
  }
}
