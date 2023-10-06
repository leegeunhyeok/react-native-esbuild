import type { Server as HTTPServer } from 'node:http';
import {
  ReactNativeEsbuildError,
  type ReactNativeEsbuildBundler,
} from '@react-native-esbuild/core';
import { DEFAULT_HOST, DEFAULT_PORT } from '../constants';
import type { DevServerOptions } from '../types';

export abstract class DevServer {
  protected initialized = false;
  protected server?: HTTPServer;
  protected bundler?: ReactNativeEsbuildBundler;
  protected devServerOptions: Required<DevServerOptions>;

  constructor(devServerOptions: DevServerOptions) {
    this.devServerOptions = {
      root: devServerOptions.root ?? process.cwd(),
      port: devServerOptions.port ?? DEFAULT_PORT,
      host: devServerOptions.host ?? DEFAULT_HOST,
    };
  }

  protected assertBundler(
    bundler?: ReactNativeEsbuildBundler,
  ): asserts bundler is ReactNativeEsbuildBundler {
    if (!bundler) {
      throw new ReactNativeEsbuildError('bundler is not ready');
    }
  }

  protected assertHTTPServer(
    httpServer?: HTTPServer,
  ): asserts httpServer is HTTPServer {
    if (!httpServer) {
      throw new ReactNativeEsbuildError('http server is not ready');
    }
  }

  public setup(delegate: (bundler: ReactNativeEsbuildBundler) => void): this {
    this.assertBundler(this.bundler);
    delegate(this.bundler);
    return this;
  }

  protected abstract initialize(): void;

  public abstract listen(onListen?: () => void): Promise<HTTPServer>;
}
