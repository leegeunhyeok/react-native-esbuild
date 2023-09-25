import type {
  IncomingMessage,
  IncomingHttpHeaders,
  ServerResponse,
} from 'node:http';
import type { FileHandle } from 'node:fs/promises';
import { faker } from '@faker-js/faker';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

interface MockedRequestParams {
  url: string | undefined;
  headers?: IncomingHttpHeaders;
}

interface MockedFileHandlerParams {
  data: string;
  size: number;
  isDirectory: boolean;
}

interface MockedBundlerParams {
  bundle: string;
  hasError: boolean;
}

export const getMockedRequest = ({
  url,
  headers = { accept: '' },
}: MockedRequestParams): IncomingMessage => {
  return {
    url,
    headers,
  } as IncomingMessage;
};

export const getMockedResponse = (): ServerResponse => {
  const response = {
    setHeader: jest.fn().mockImplementation(() => response),
    writeHead: jest.fn().mockImplementation(() => response),
    end: jest.fn().mockImplementation(() => response),
  } as unknown as ServerResponse;

  return response;
};

export const getMockedFileHandler = ({
  data,
  size,
  isDirectory,
}: MockedFileHandlerParams): FileHandle => {
  return {
    stat: jest.fn().mockReturnValue({
      size,
      isDirectory: jest.fn().mockReturnValue(isDirectory),
    }),
    readFile: jest.fn().mockReturnValue(Promise.resolve(data)),
    close: jest.fn().mockReturnValue(Promise.resolve()),
  } as unknown as FileHandle;
};

export const getMockedBundler = ({
  bundle,
  hasError,
}: MockedBundlerParams): ReactNativeEsbuildBundler => {
  return {
    getBundle: jest
      .fn()
      .mockReturnValue(
        hasError
          ? Promise.reject()
          : Promise.resolve({ source: bundle, bundledAt: faker.date.past() }),
      ),
    on: jest.fn(),
    off: jest.fn(),
  } as unknown as ReactNativeEsbuildBundler;
};
