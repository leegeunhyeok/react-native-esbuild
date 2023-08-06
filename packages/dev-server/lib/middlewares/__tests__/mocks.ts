import type { IncomingMessage, ServerResponse } from 'node:http';
import type { FileHandle } from 'node:fs/promises';
import type { ReactNativeEsbuildBundler } from '@react-native-esbuild/core';

interface MockedRequestParams {
  url: string | undefined;
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

export function getMockedRequest({
  url,
}: MockedRequestParams): IncomingMessage {
  return { url } as IncomingMessage;
}

export function getMockedResponse(): ServerResponse {
  const response = {
    writeHead: jest.fn().mockImplementation(() => response),
    end: jest.fn().mockImplementation(() => response),
  } as unknown as ServerResponse;

  return response;
}

export function getMockedFileHandler({
  data,
  size,
  isDirectory,
}: MockedFileHandlerParams): FileHandle {
  return {
    stat: jest.fn().mockReturnValue({
      size,
      isDirectory: jest.fn().mockReturnValue(isDirectory),
    }),
    readFile: jest.fn().mockReturnValue(Promise.resolve(data)),
    close: jest.fn().mockReturnValue(Promise.resolve()),
  } as unknown as FileHandle;
}

export function getMockedBundler({
  bundle,
  hasError,
}: MockedBundlerParams): ReactNativeEsbuildBundler {
  return {
    getBundle: jest
      .fn()
      .mockReturnValue(hasError ? Promise.reject() : Promise.resolve(bundle)),
  } as unknown as ReactNativeEsbuildBundler;
}
