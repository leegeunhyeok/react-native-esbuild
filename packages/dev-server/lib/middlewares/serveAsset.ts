import fs, { type FileHandle } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import mime from 'mime';
import { ASSET_PATH } from '@react-native-esbuild/config';
import { logger } from '../shared';
import type { DevServerMiddlewareCreator } from '../types';

const TAG = 'serve-asset-middleware';

const resolveAndLoadAssetData = (
  assetPath: string,
  platform?: string,
): Promise<{ data: Buffer; headers: Record<string, string | number> }> => {
  const extname = path.extname(assetPath);
  const resolvePath = platform
    ? assetPath.replace(new RegExp(`${extname}$`), `.${platform}${extname}`)
    : assetPath;
  let fileHandle: FileHandle | undefined;

  return fs
    .open(resolvePath, 'r')
    .then((handle) => (fileHandle = handle))
    .then(async (handle) => {
      return {
        data: await handle.readFile(),
        headers: {
          'Content-Type': mime.getType(assetPath) ?? '',
          'Content-Length': (await handle.stat()).size,
        },
      };
    })
    .finally(() => void fileHandle?.close());
};

export const createServeAssetMiddleware: DevServerMiddlewareCreator = (
  context,
) => {
  return function serveAssetMiddleware(request, response, next) {
    if (
      !(
        typeof request.url === 'string' &&
        request.url.startsWith(`/${ASSET_PATH}`)
      )
    ) {
      next();
      return;
    }

    const { pathname, query } = url.parse(
      request.url.replace(new RegExp(`^/${ASSET_PATH}`), ''),
      true,
    );

    if (!pathname) {
      logger.warn(`(${TAG}) unable to parse pathname`);
      return response.writeHead(400).end();
    }

    const assetPath = path.join(context.bundler.getRoot(), pathname);

    return void (async function resolveAssetWithPlatformSuffix() {
      const hasPlatform = typeof query.platform === 'string';

      /**
       * 1. Resolve platform suffixed asset path.
       * 2. If unable to resolve, try non-suffixed asset path.
       */
      try {
        return await resolveAndLoadAssetData(
          assetPath,
          // @ts-expect-error -- `platform` is string.
          hasPlatform ? query.platform : undefined,
        );
      } catch (error) {
        if (hasPlatform) {
          return resolveAndLoadAssetData(assetPath);
        }
        throw error;
      }
    })()
      .then(({ data, headers }) => {
        response.writeHead(200, headers).end(data);
      })
      .catch((error) => {
        logger.error(`unable to serve asset: ${assetPath}`, error as Error);
        response.writeHead(500).end();
      });
  };
};
