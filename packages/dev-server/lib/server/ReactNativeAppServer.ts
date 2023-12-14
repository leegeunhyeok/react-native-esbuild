import http, { type Server as HTTPServer } from 'node:http';
import { parse } from 'node:url';
import type { WebSocketServer } from 'ws';
import type { Server } from 'connect';
import invariant from 'invariant';
import { InspectorProxy } from 'metro-inspector-proxy';
import { createDevServerMiddleware } from '@react-native-community/cli-server-api';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  createHmrMiddlewareForApp,
  createServeAssetMiddleware,
  createServeBundleMiddleware,
  createSymbolicateMiddleware,
  createIndexPageMiddleware,
} from '../middlewares';
import { logger } from '../shared';
import type { BroadcastCommand, DevServerMiddlewareContext } from '../types';
import { DevServer } from './DevServer';

/**
 * Development server for native application (Android, iOS)
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
  private inspectorProxy?: InspectorProxy;

  async initialize(
    onPostSetup?: (bundler: ReactNativeEsbuildBundler) => void | Promise<void>,
  ): Promise<this> {
    if (this.initialized) {
      logger.warn('dev server already initialized');
      return this;
    }

    logger.debug('setup bundler');
    // eslint-disable-next-line no-multi-assign -- Allow multi assign.
    const bundler = (this.bundler = await new ReactNativeEsbuildBundler(
      this.devServerOptions.root,
    ).initialize({ watcherEnabled: true }));

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
    this.inspectorProxy = new InspectorProxy(this.devServerOptions.root);

    logger.debug('create http server');
    this.server = http.createServer(middleware);
    this.setupMiddlewares(middleware);

    await onPostSetup?.(bundler);

    this.initialized = true;
    return this;
  }

  private setupMiddlewares(server: Server): void {
    invariant(this.bundler, 'bundler is not ready');
    invariant(this.inspectorProxy, 'inspector proxy is not ready');
    logger.debug('setup middlewares');

    const context: DevServerMiddlewareContext = {
      bundler: this.bundler,
      devServerOptions: this.devServerOptions,
    };

    // Middleware for logging http requests.
    server.use((request, _response, next) => {
      if (request.method && request.url) {
        logger.debug(`[${request.method}] ${request.url}`, request.headers);
      }
      next();
    });

    server.use(this.inspectorProxy.processRequest.bind(this.inspectorProxy));
    server.use(createServeAssetMiddleware(context));
    server.use(createServeBundleMiddleware(context));
    server.use(createSymbolicateMiddleware(context));
    server.use(createIndexPageMiddleware(context));
  }

  private setupWebSocketServers(): void {
    logger.debug('setup web socket handlers');

    if (!(this.server && this.bundler && this.inspectorProxy)) {
      throw new Error('server is not initialized');
    }

    const { server: hmrServer, ...hmr } = createHmrMiddlewareForApp({
      onMessage: (message) => {
        switch (message.type) {
          case 'log': {
            const clientLogEvent = {
              type: 'client_log',
              level: message.level,
              data: message.data,
              mode: 'BRIDGE',
            } as const;
            this.bundler?.emit('report', clientLogEvent);
            this.eventsSocketEndpoint.reportEvent(clientLogEvent);
            break;
          }

          // not supported
          case 'register-entrypoints':
          case 'log-opt-in':
            break;
        }
      },
    });

    /**
     * Inspector proxy handlers.
     *
     * - `/inspector/device`
     * - `/inspector/debug`
     */
    const inspectorProxyWss = this.inspectorProxy.createWebSocketListeners(
      this.server,
    );

    const webSocketServer: Record<string, WebSocketServer> = {
      '/hot': hmrServer.getWebSocketServer(),
      '/debugger-proxy': this.debuggerProxyEndpoint.server,
      '/message': this.messageSocketEndpoint.server,
      '/events': this.eventsSocketEndpoint.server,
      ...inspectorProxyWss,
    };

    this.bundler.on('build-start', hmr.updateStart);
    this.bundler.on('build-end', ({ revisionId, update, additionalData }) => {
      // `additionalData` can be `{ disableRefresh: true }` by `serve-asset-middleware`.
      if (!additionalData?.disableRefresh) {
        update === null || update.fullyReload
          ? hmr.liveReload(revisionId)
          : hmr.hotReload(revisionId, update.code);
      }
      hmr.updateDone();
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

  // eslint-disable-next-line @typescript-eslint/require-await -- Allow no await for return `Promise`.
  async listen(onListen?: () => void): Promise<HTTPServer> {
    invariant(this.bundler, 'bundler is not ready');
    invariant(this.server, 'server is not ready');
    const { host, port } = this.devServerOptions;

    return this.server.listen(port, () => {
      this.setupWebSocketServers();
      logger.info(`dev server listening on http://${host}:${port}`);
      logger.nl();
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
