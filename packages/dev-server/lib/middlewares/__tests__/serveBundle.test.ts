import type { IncomingMessage, ServerResponse } from 'node:http';
import { faker } from '@faker-js/faker';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';
import { createServeBundleMiddleware } from '../serveBundle';
import type { DevServerMiddleware } from '../../types';
import { getMockedBundler, getMockedRequest, getMockedResponse } from './mocks';

describe('serve-asset-middleware', () => {
  let bundle: string;
  let bundler: ReactNativeEsbuildBundler;
  let middleware: DevServerMiddleware;

  beforeEach(() => {
    bundle = faker.string.alphanumeric(50);
    bundler = getMockedBundler({ bundle, watchModeStarted: true });
    middleware = createServeBundleMiddleware({
      devServerOptions: {
        host: '127.0.0.1',
        port: 8081,
      },
      bundler,
    });
  });

  describe('when request url is empty', () => {
    let request: IncomingMessage;
    let response: ServerResponse;
    let next: jest.Mock;

    beforeEach(() => {
      request = getMockedRequest({ url: undefined });
      response = getMockedResponse();
      next = jest.fn();
      middleware(request, response, next);
    });

    it('should skip', () => {
      expect(next).toBeCalledTimes(1);
    });
  });

  describe('when request url is invalid ', () => {
    let response: ServerResponse;

    beforeEach(() => {
      response = getMockedResponse();
      middleware(
        getMockedRequest({ url: 'main.bundle?platform=unknown' }),
        response,
        jest.fn(),
      );
    });

    it('should response with status 400', () => {
      expect(response.writeHead).toBeCalledWith(400);
      expect(response.end).toBeCalled();
    });
  });

  describe('when request url is valid ', () => {
    let bundleRequestUrl: string;
    let request: IncomingMessage;
    let response: ServerResponse;
    let next: jest.Mock;

    describe('bundler is not watching', () => {
      beforeEach(() => {
        const platform = faker.helpers.arrayElement(['android', 'ios', 'web']);
        bundler = getMockedBundler({ bundle, watchModeStarted: false });
        middleware = createServeBundleMiddleware({
          devServerOptions: {
            host: '127.0.0.1',
            port: 8081,
          },
          bundler,
        });
        bundleRequestUrl = `main.bundle?platform=${platform}`;
        request = getMockedRequest({ url: bundleRequestUrl });
        response = getMockedResponse();
        next = jest.fn();
        middleware(request, response, next);
      });

      it('should start bundler watch mode', () => {
        expect(bundler.getBundle).toBeCalled();
        expect(bundler.watch).toBeCalled();
      });
    });

    describe('bundler is watching', () => {
      beforeEach(() => {
        const platform = faker.helpers.arrayElement(['android', 'ios', 'web']);
        bundler = getMockedBundler({ bundle, watchModeStarted: true });
        middleware = createServeBundleMiddleware({
          devServerOptions: {
            host: '127.0.0.1',
            port: 8081,
          },
          bundler,
        });
        bundleRequestUrl = `main.bundle?platform=${platform}`;
        request = getMockedRequest({ url: bundleRequestUrl });
        response = getMockedResponse();
        next = jest.fn();
        middleware(request, response, next);
      });

      it('should response bundle with status 200', () => {
        expect(response.writeHead).toBeCalledWith(200, {
          'Content-Type': 'application/javascript',
        });
        expect(response.end).toBeCalledWith(bundle);
      });
    });
  });
});
