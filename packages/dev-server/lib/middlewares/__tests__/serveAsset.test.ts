import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { ASSET_PATH } from '@react-native-esbuild/config';
import { faker } from '@faker-js/faker';
import { createServeAssetMiddleware } from '../serveAsset';
import type { DevServerMiddleware } from '../../types';
import {
  getMockedRequest,
  getMockedResponse,
  getMockedFileHandler,
} from './mocks';

describe('serve-asset-middleware', () => {
  let middleware: DevServerMiddleware;

  beforeEach(() => {
    middleware = createServeAssetMiddleware({
      devServerOptions: {
        host: 'localhost',
        port: 8081,
      },
      bundler: {
        getRoot: jest.fn().mockReturnValue('/root'),
      } as unknown as ReactNativeEsbuildBundler,
    });
  });

  describe('when request url is empty', () => {
    let request: IncomingMessage;
    let response: ServerResponse;
    let next: jest.Mock;

    beforeEach(() => {
      request = getMockedRequest({ url: '' });
      response = getMockedResponse();
      next = jest.fn();
      middleware(request, response, next);
    });

    it('should skip', () => {
      expect(next).toBeCalledTimes(1);
    });
  });

  describe('when request url is valid asset url', () => {
    let assetRequestUrl: string;
    let request: IncomingMessage;
    let response: ServerResponse;
    let next: jest.Mock;

    beforeEach(() => {
      assetRequestUrl = path.join(ASSET_PATH, faker.system.fileName());
      request = getMockedRequest({ url: `/${assetRequestUrl}` });
      response = getMockedResponse();
      next = jest.fn();
    });

    describe('asset path is directory', () => {
      beforeEach(() => {
        jest.spyOn(fs, 'open').mockImplementation(() => {
          return Promise.resolve(
            getMockedFileHandler({
              data: faker.string.alphanumeric(10),
              size: faker.number.int(),
              isDirectory: true,
            }),
          );
        });
        middleware(request, response, next);
      });

      it('should response with status 500', () => {
        expect(response.writeHead).toBeCalledWith(500);
        expect(response.end).toBeCalled();
      });
    });

    describe('asset path is file', () => {
      let data: string;
      let size: number;

      beforeEach(() => {
        data = faker.string.alphanumeric(10);
        size = faker.number.int();
        jest.spyOn(fs, 'open').mockImplementation(() => {
          return Promise.resolve(
            getMockedFileHandler({
              data,
              size,
              isDirectory: false,
            }),
          );
        });
        middleware(request, response, next);
      });

      it('should response data with status 200', () => {
        expect(response.writeHead).toBeCalledWith(
          200,
          expect.objectContaining({ 'Content-Length': size }),
        );
        expect(response.end).toBeCalledWith(data);
      });
    });
  });
});
