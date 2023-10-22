import type { Server as HTTPServer } from 'node:http';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
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

  public abstract initialize(
    onPostSetup?: (bundler: ReactNativeEsbuildBundler) => void | Promise<void>,
  ): Promise<this>;

  public abstract listen(onListen?: () => void): Promise<HTTPServer>;
}
