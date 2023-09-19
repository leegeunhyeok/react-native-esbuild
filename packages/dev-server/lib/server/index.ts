import http, { type Server as HTTPServer } from 'node:http';
import { parse } from 'node:url';
import type { WebSocketServer } from 'ws';
import type { Server } from 'connect';
import {
  createDevServerMiddleware,
  indexPageMiddleware,
} from '@react-native-community/cli-server-api';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { InspectorProxy } from 'metro-inspector-proxy';
import {
  createHotReloadMiddleware,
  createServeAssetMiddleware,
  createServeBundleMiddleware,
  createSymbolicateMiddleware,
} from '../middlewares';
import { logger } from '../shared';
import { DEFAULT_PORT, DEFAULT_HOST } from '../constants';
import type {
  DevServerMiddlewareContext,
  DevServerOptions,
  TypedInspectorProxy,
} from '../types';

export class ReactNativeEsbuildDevServer {
  private initialized = false;
  private devServerOptions: Required<DevServerOptions>;
  private bundler?: ReactNativeEsbuildBundler;
  private server?: HTTPServer;
  private debuggerProxyEndpoint: ReturnType<
    typeof createDevServerMiddleware
  >['debuggerProxyEndpoint'];
  private messageSocketEndpoint: ReturnType<
    typeof createDevServerMiddleware
  >['messageSocketEndpoint'];
  private eventsSocketEndpoint: ReturnType<
    typeof createDevServerMiddleware
  >['eventsSocketEndpoint'];
  private inspectorProxy?: TypedInspectorProxy;

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

    const root = process.cwd();
    logger.debug('setup dev server', this.devServerOptions);
    logger.debug('create bundler instance');

    const {
      middleware,
      debuggerProxyEndpoint,
      messageSocketEndpoint,
      eventsSocketEndpoint,
    } = createDevServerMiddleware({
      port: this.devServerOptions.port,
      host: this.devServerOptions.host,
      watchFolders: [],
    });

    this.debuggerProxyEndpoint = debuggerProxyEndpoint;
    this.messageSocketEndpoint = messageSocketEndpoint;
    this.eventsSocketEndpoint = eventsSocketEndpoint;
    this.inspectorProxy =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new InspectorProxy(root) as TypedInspectorProxy;

    this.bundler = new ReactNativeEsbuildBundler(root);
    this.setupMiddlewares(middleware);

    logger.debug('create http server');
    this.server = http.createServer(middleware);

    return { server: this, bundler: this.bundler };
  }

  private setupMiddlewares(server: Server): void {
    logger.debug('setup middlewares');

    if (!(this.bundler && this.inspectorProxy)) {
      throw new Error('unable to setup middlewares');
    }

    const context: DevServerMiddlewareContext = {
      bundler: this.bundler,
      devServerOptions: this.devServerOptions,
    };

    // middleware for http logging
    server.use((request, _response, next) => {
      if (request.method && request.url) {
        logger.debug(`[${request.method}] ${request.url}`, request.headers);
      }
      next();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    server.use(this.inspectorProxy.processRequest.bind(this.inspectorProxy));
    server.use(createServeAssetMiddleware(context));
    server.use(createServeBundleMiddleware(context));
    server.use(createSymbolicateMiddleware(context));
    server.use(indexPageMiddleware);
  }

  private setupWebSocketServers(): void {
    logger.debug('setup web socket handlers');

    if (!(this.server && this.bundler && this.inspectorProxy)) {
      throw new Error('server is not initialized');
    }

    const { server: hotReloadWss, ...hr } = createHotReloadMiddleware(
      (event) => {
        this.eventsSocketEndpoint.reportEvent(event);
      },
    );

    const inspectorProxyWss = this.inspectorProxy.createWebSocketListeners(
      this.server,
    );

    const webSocketServer: Record<string, WebSocketServer> = {
      '/hot': hotReloadWss,
      '/debugger-proxy': this.debuggerProxyEndpoint.server,
      '/message': this.messageSocketEndpoint.server,
      '/events': this.eventsSocketEndpoint.server,
      // handle `/inspector/device`
      // handle `/inspector/debug`
      ...inspectorProxyWss,
    };

    this.bundler.on('build-start', hr.updateStart);
    this.bundler.on('build-end', ({ revisionId, additionalData }) => {
      // add additionalData `{ disableRefresh: true }` from `serve-asset-middleware`
      if (!additionalData?.disableRefresh) {
        hr.hotReload(revisionId);
      }
      hr.updateDone();
    });

    this.server.on('upgrade', (request, socket, head) => {
      if (!request.url) return;

      const { pathname } = parse(request.url);

      const wss = pathname ? webSocketServer[pathname] : null;

      /**
       * @see {@link https://github.com/facebook/metro/blob/v0.77.0/packages/metro/src/index.flow.js#L230-L239}
       */
      if (wss) {
        wss.handleUpgrade(request, socket, head, (client) => {
          wss.emit('connection', client, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  listen(): HTTPServer {
    this.assertBundler(this.bundler);
    this.assertHTTPServer(this.server);
    const { host, port } = this.devServerOptions;

    return this.server.listen(port, () => {
      this.setupWebSocketServers();

      process.stdout.write('\n');
      logger.info(`dev server listening on http://${host}:${port}`);
      process.stdout.write('\n');
    });
  }
}
