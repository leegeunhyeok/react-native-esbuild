import http, { type Server as HTTPServer } from 'node:http';
import { parse } from 'node:url';
import type { WebSocketServer } from 'ws';
import type { Server } from 'connect';
import { createDevServerMiddleware } from '@react-native-community/cli-server-api';
import {
  ReactNativeEsbuildBundler,
  ReactNativeEsbuildError,
} from '@react-native-esbuild/core';
import { InspectorProxy } from 'metro-inspector-proxy';
import {
  createHotReloadMiddleware,
  createServeAssetMiddleware,
  createServeBundleMiddleware,
  createSymbolicateMiddleware,
  createIndexPageMiddleware,
} from '../middlewares';
import { logger } from '../shared';
import type {
  BroadcastCommand,
  DevServerMiddlewareContext,
  DevServerOptions,
  TypedInspectorProxy,
} from '../types';
import { DevServer } from './DevServer';

/**
 * development server for native application
 */
export class ReactNativeAppServer extends DevServer {
  private wsInitialized = false;
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
    super(devServerOptions);
    this.initialize();
  }

  initialize(): void {
    if (this.initialized) {
      logger.warn('dev server already initialized');
      return;
    }

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- InspectorProxy isn't well typed
      new InspectorProxy(this.devServerOptions.root) as TypedInspectorProxy;

    logger.debug('create http server');
    this.server = http.createServer(middleware);
    this.bundler = new ReactNativeEsbuildBundler(this.devServerOptions.root);
    this.setupMiddlewares(middleware);

    this.initialized = true;
  }

  private setupMiddlewares(server: Server): void {
    logger.debug('setup middlewares');

    if (!(this.bundler && this.inspectorProxy)) {
      throw new ReactNativeEsbuildError('unable to setup middlewares');
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- for bind
    server.use(this.inspectorProxy.processRequest.bind(this.inspectorProxy));
    server.use(createServeAssetMiddleware(context));
    server.use(createServeBundleMiddleware(context));
    server.use(createSymbolicateMiddleware(context));
    server.use(createIndexPageMiddleware(context));
  }

  private setupWebSocketServers(): void {
    logger.debug('setup web socket handlers');

    if (!(this.server && this.bundler && this.inspectorProxy)) {
      throw new ReactNativeEsbuildError('server is not initialized');
    }

    const { server: hotReloadWss, ...hr } = createHotReloadMiddleware({
      onLog: (event) => {
        this.eventsSocketEndpoint.reportEvent(event);
        this.bundler?.emit('report', event);
      },
    });

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

    this.server.on('error', (error) => {
      logger.error('http server error', error);
      process.exit(1);
    });

    this.wsInitialized = true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await -- allow no await
  async listen(onListen?: () => void): Promise<HTTPServer> {
    this.assertBundler(this.bundler);
    this.assertHTTPServer(this.server);
    const { host, port } = this.devServerOptions;

    return this.server.listen(port, () => {
      this.setupWebSocketServers();
      logger.info(`dev server listening on http://${host}:${port}`);
      process.stdout.write('\n');
      onListen?.();
    });
  }

  broadcastCommand(command: BroadcastCommand): void {
    if (!this.wsInitialized) {
      logger.warn('web socket is not initialized');
      return;
    }
    logger.debug(`broadcasting '${command}' command`);
    this.messageSocketEndpoint.broadcast(command);
  }
}
