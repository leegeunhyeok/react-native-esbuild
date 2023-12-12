import http, {
  type Server as HTTPServer,
  type ServerResponse,
  type IncomingMessage,
} from 'node:http';
import { parse } from 'node:url';
import type { ServeResult } from 'esbuild';
import invariant from 'invariant';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  combineWithDefaultBundleOptions,
  type BundleOptions,
} from '@react-native-esbuild/shared';
import {
  createHMRMiddlewareForWeb,
  createSymbolicateMiddleware,
} from '../middlewares';
import { logger } from '../shared';
import type { DevServerOptions } from '../types';
import { DevServer } from './DevServer';

/**
 * Development server for web platform
 */
export class ReactNativeWebServer extends DevServer {
  private bundleOptions: BundleOptions;
  private serveResult?: ServeResult;

  constructor(
    devServerOptions: DevServerOptions,
    bundleOptions?: Partial<BundleOptions>,
  ) {
    super(devServerOptions);
    this.bundleOptions = combineWithDefaultBundleOptions(bundleOptions ?? {});
  }

  private proxyHandler(
    request: IncomingMessage,
    response: ServerResponse,
  ): void {
    if (!this.serveResult) {
      logger.debug('esbuild context is not serving now');
      return;
    }

    const options = {
      hostname: this.serveResult.host,
      port: this.serveResult.port,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };

    const proxyRequest = http.request(options, (proxyResponse) => {
      logger.debug('proxy request', options);

      if (typeof proxyResponse.statusCode !== 'number') {
        logger.warn('invalid response status', proxyResponse.statusCode);
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>internal error</h1>');
        return;
      }

      if (proxyResponse.statusCode === 404) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>not found</h1>');
        return;
      }

      response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.pipe(response, { end: true });
    });

    request.pipe(proxyRequest, { end: true });
  }

  private parseBody(request: IncomingMessage): Promise<void> {
    const body: Buffer[] = [];
    return new Promise((resolve, _reject) => {
      request
        .on('data', (chunk: Buffer) => body.push(chunk))
        .on('end', () => {
          request.rawBody = Buffer.concat(body).toString();
          resolve();
        });
    });
  }

  async initialize(): Promise<this> {
    if (this.initialized) {
      logger.warn('dev server already initialized');
      return this;
    }

    logger.debug('setup bundler');
    // eslint-disable-next-line no-multi-assign -- Allow multi assign.
    const bundler = (this.bundler = await new ReactNativeEsbuildBundler(
      this.devServerOptions.root,
    ).initialize({ watcherEnabled: true }));

    const { server: hmrServer, ...hmr } = createHMRMiddlewareForWeb();

    this.bundler.on('build-end', ({ revisionId, update, additionalData }) => {
      if (!additionalData?.disableRefresh) {
        update?.fullyReload
          ? hmr.liveReload(revisionId)
          : hmr.hotReload(revisionId, update?.code ?? '');
      }
    });

    const symbolicateMiddleware = createSymbolicateMiddleware(
      { bundler, devServerOptions: this.devServerOptions },
      { webBundleOptions: this.bundleOptions },
    );

    logger.debug('create http server');
    this.server = http.createServer((request, response) => {
      this.parseBody(request).then(() => {
        /**
         * 1. Send request to middlewares.
         * 2. If not handled, send request to esbuild via proxy handler.
         */
        symbolicateMiddleware(request, response, () => {
          this.proxyHandler(request, response);
        });
      });
    });

    this.server.on('upgrade', (request, socket, head) => {
      if (!request.url) return;
      const { pathname } = parse(request.url);

      if (pathname === '/hot') {
        const wss = hmrServer.getWebSocketServer();
        wss.handleUpgrade(request, socket, head, (client) => {
          wss.emit('connection', client, request);
        });
      } else {
        socket.destroy();
      }
    });

    return this;
  }

  async listen(onListen?: () => void): Promise<HTTPServer> {
    invariant(this.bundler, 'bundler is not ready');
    invariant(this.server, 'server is not ready');

    const server = this.server;
    const { host, port } = this.devServerOptions;

    const serveResult = await this.bundler.serve(this.bundleOptions);
    this.serveResult = serveResult;

    server.listen(port, () => {
      logger.info(`dev server listening on http://${host}:${port}`);
      logger.debug(`proxy to esbuild ${serveResult.host}:${serveResult.port}`);
      logger.nl();
      onListen?.();
    });

    return this.server;
  }
}
