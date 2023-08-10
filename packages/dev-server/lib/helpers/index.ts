import type { ServerResponse } from 'node:http';
import type { ParsedUrlQuery } from 'node:querystring';
import { z } from 'zod';
import type { LogLevel } from '@react-native-esbuild/utils';
import { logger } from '../shared';
import type { DevServerMiddleware, LogMessage } from '../types';

export type ParsedBundleConfig = z.infer<typeof bundleSearchParamSchema>;

const toBoolean = (val: z.infer<typeof boolean>): boolean => val === 'true';

const boolean = z.union([z.literal('true'), z.literal('false')]);
const bundleSearchParamSchema = z
  .object({
    // required
    platform: z.union([
      z.literal('android'),
      z.literal('ios'),
      z.literal('web'),
    ]),
    // optional
    dev: boolean.default('true').transform(toBoolean),
    minify: boolean.default('false').transform(toBoolean),
    runModule: boolean.default('false').transform(toBoolean),
  })
  .required();

export function parseBundleConfigFromSearchParams(
  query: ParsedUrlQuery,
): ParsedBundleConfig {
  const platform = query.platform;
  const dev = query.dev;
  const minify = query.minify;
  const runModule = query.runModule;

  return bundleSearchParamSchema.parse({
    platform,
    dev,
    minify,
    runModule,
  });
}

export function toSafetyMiddleware(
  middleware: DevServerMiddleware,
): DevServerMiddleware {
  return function wrap(request, response, next) {
    try {
      middleware(request, response, next);
    } catch (error) {
      response.writeHead(500).end();
    }
  };
}

export function convertHmrLogLevel(level: LogMessage['level']): LogLevel {
  switch (level) {
    case 'group':
    case 'groupCollapsed':
    case 'groupEnd':
    case 'trace':
      return 'log';

    default:
      return level;
  }
}

/**
 * Send bundle task status and write bundle to client
 *
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/Server.js#L664-L672}
 */
export class BundleResponse {
  private static CRLF = '\r\n';
  private static THROTTLE_DELAY = 500;
  private isSupportMultipart: boolean;
  private boundary: string;
  private throttleTimer: NodeJS.Timeout | null = null;

  constructor(
    private response: ServerResponse,
    accept?: string,
  ) {
    const isSupportMultipart = accept?.includes('multipart/mixed') ?? false;
    const boundary = new Date().getTime().toString();
    if (isSupportMultipart) {
      response.writeHead(200, {
        'Content-Type': `multipart/mixed; boundary="${boundary}"`,
      });
    } else {
      logger.debug('client is not support multipart/mixed content', { accept });
    }
    this.isSupportMultipart = isSupportMultipart;
    this.boundary = boundary;
  }

  private writeChunk(
    headers: Record<string, string>,
    data: string | Buffer | Uint8Array,
    isLast?: boolean,
  ): void {
    if (this.response.writableEnded) {
      return;
    }

    const CRLF = BundleResponse.CRLF;
    this.response.write(`${CRLF}--${this.boundary}${CRLF}`);
    this.response.write(
      Object.entries(headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join(CRLF) +
        CRLF +
        CRLF,
    );
    this.response.write(data);

    if (isLast) {
      this.response.write(`${CRLF}--${this.boundary}--${CRLF}`);
      this.response.end();
    }
  }

  /**
   * Send bundle state to client (it will be displayed at the top of device)
   *
   * If client isn't support multipart format, do nothing.
   *
   * - Sample response
   * ```text
   * --boundary
   *
   * Content-Type: application/json
   *
   * {"done":10,"total":100}
   * ```
   */
  writeBundleState(done: number, total: number): void {
    if (!this.isSupportMultipart || total < 10 || this.throttleTimer !== null) {
      return;
    }

    this.writeChunk(
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({ done, total }),
    );

    this.throttleTimer = setTimeout(() => {
      this.throttleTimer = null;
    }, BundleResponse.THROTTLE_DELAY);
  }

  /**
   * Send bundle result
   *
   * - Sample response
   * ```text
   * --boundary
   *
   * X-Metro-Files-Changed-Count: 0
   * Content-Type: application/json
   * Content-Length: 100
   * Last-Modified: Thu, 10 Aug 2023 12:00:00 GMT
   *
   * <bundle result>
   * ```
   */
  endWithBundle(bundle: Uint8Array, modifiedAt: Date): void {
    if (this.isSupportMultipart) {
      this.writeChunk(
        {
          'X-Metro-Files-Changed-Count': String(0),
          'Content-Type': 'application/javascript; charset=UTF-8',
          'Content-Length': String(bundle.byteLength),
          'Last-Modified': modifiedAt.toUTCString(),
        },
        bundle,
        true,
      );
    } else {
      this.response.writeHead(200).end(bundle);
    }
  }

  endWithError(): void {
    this.response.writeHead(500).end();
  }
}
