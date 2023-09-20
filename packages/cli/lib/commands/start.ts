import { ReactNativeEsbuildDevServer } from '@react-native-esbuild/dev-server';
import {
  createAssetRegisterPlugin,
  createReactNativeRuntimeTransformPlugin,
  createSvgTransformPlugin,
} from '@react-native-esbuild/plugins';
import { enableInteractiveMode } from '../helpers';
import { logger } from '../shared';
import type { StartOptions } from '../types';

export function start(options: StartOptions): void {
  const startOptions = options;
  const { bundler, server } = new ReactNativeEsbuildDevServer(
    startOptions,
  ).initialize();

  bundler
    .registerPlugin(createAssetRegisterPlugin())
    .registerPlugin(createSvgTransformPlugin())
    .registerPlugin(createReactNativeRuntimeTransformPlugin());

  server.listen(() => {
    if (
      enableInteractiveMode((keyName) => {
        switch (keyName) {
          case 'r':
            server.broadcastCommand('reload');
            break;

          case 'd':
            server.broadcastCommand('devMenu');
            break;
        }
      })
    ) {
      // eslint-disable-next-line quotes -- pass
      logger.info(`› press 'r' to reload`);
      // eslint-disable-next-line quotes -- pass
      logger.info(`› press 'd' to open developer menu`);
      process.stdout.write('\n');
    }
  });
}
