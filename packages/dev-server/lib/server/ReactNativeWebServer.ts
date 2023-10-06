import http, {
  type Server as HTTPServer,
  type ServerResponse,
  type IncomingMessage,
} from 'node:http';
import type { ServeResult } from 'esbuild';
import { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import {
  combineWithDefaultBundleOptions,
  type BundleOptions,
} from '@react-native-esbuild/config';
import { logger } from '../shared';
import type { DevServerOptions } from '../types';
import { DevServer } from './DevServer';

/**
 * development server for web platform
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
    this.initialize();
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

  initialize(): void {
    if (this.initialized) {
      logger.warn('dev server already initialized');
      return;
    }

    logger.debug('create http server');
    this.server = http.createServer((request, response) => {
      this.proxyHandler(request, response);
    });

    this.bundler = new ReactNativeEsbuildBundler(this.devServerOptions.root);
    this.initialized = true;
  }

  async listen(onListen?: () => void): Promise<HTTPServer> {
    this.assertBundler(this.bundler);
    this.assertHTTPServer(this.server);

    const server = this.server;
    const { host, port } = this.devServerOptions;

    const serveResult = await this.bundler.serve(this.bundleOptions);
    this.serveResult = serveResult;

    server.listen(port, () => {
      logger.info(`dev server listening on http://${host}:${port}`);
      logger.debug(`proxy to esbuild ${serveResult.host}:${serveResult.port}`);
      process.stdout.write('\n');
      onListen?.();
    });

    return this.server;
  }
}
