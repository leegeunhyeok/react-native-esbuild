import { codeFrameColumns } from '@babel/code-frame';
import { SourceMapConsumer, type NullableMappedPosition } from 'source-map';
import type {
  Frame,
  ConfiguredFrame,
  CodeFrame,
  SymbolicateResult,
} from './types';

/**
 * @see {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/metro-config/index.js#L15-L33}
 */
const INTERNAL_CALLSITES_REGEX = new RegExp(
  [
    '/Libraries/BatchedBridge/MessageQueue\\.js$',
    '/Libraries/Core/.+\\.js$',
    '/Libraries/LogBox/.+\\.js$',
    '/Libraries/Network/.+\\.js$',
    '/Libraries/Pressability/.+\\.js$',
    '/Libraries/Renderer/implementations/.+\\.js$',
    '/Libraries/Utilities/.+\\.js$',
    '/Libraries/vendor/.+\\.js$',
    '/Libraries/WebSocket/.+\\.js$',
    '/Libraries/YellowBox/.+\\.js$',
    '/metro-runtime/.+\\.js$',
    '/node_modules/@babel/runtime/.+\\.js$',
    '/node_modules/event-target-shim/.+\\.js$',
    '/node_modules/invariant/.+\\.js$',
    '/node_modules/react-devtools-core/.+\\.js$',
    '/node_modules/react-native/index.js$',
    '/node_modules/react-refresh/.+\\.js$',
    '/node_modules/scheduler/.+\\.js$',
    '^\\[native code\\]$',
  ].join('|'),
);

const convertMappedPositionKeyToFrameKey = (
  key: keyof NullableMappedPosition,
): keyof Frame => {
  if (key === 'line') {
    return 'lineNumber';
  } else if (key === 'source') {
    return 'file';
  } else if (key === 'name') {
    return 'methodName';
  }
  return key;
};

const originalPositionFor = (
  sourcemapConsumer: SourceMapConsumer,
  frame: Frame,
): Frame => {
  if (!(frame.lineNumber && frame.column)) frame;

  const originalPosition = sourcemapConsumer.originalPositionFor({
    column: frame.column,
    line: frame.lineNumber,
  });

  return Object.entries(originalPosition).reduce(
    (targetFrame, [key, value]) => {
      const targetKey = convertMappedPositionKeyToFrameKey(
        key as keyof typeof originalPosition,
      );
      return {
        ...targetFrame,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allow for `Object.entries()`.
        ...(value ? { [targetKey]: value } : null),
      };
    },
    frame,
  );
};

const collapseFrame = (frame: Frame): ConfiguredFrame => {
  return {
    ...frame,
    __collapse: Boolean(
      frame.file && INTERNAL_CALLSITES_REGEX.test(frame.file),
    ),
  };
};

/**
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/Server.js#L1111-L1150}
 */
const getCodeFrame = (
  sourcemapConsumer: SourceMapConsumer,
  frames: ConfiguredFrame[],
): CodeFrame | null => {
  const frame = frames.find(
    ({ lineNumber, column, __collapse }) => lineNumber && column && !__collapse,
  );

  if (!(frame?.file && frame.column && frame.lineNumber)) {
    return null;
  }

  try {
    const source = sourcemapConsumer.sourceContentFor(frame.file);
    const { lineNumber, column, file } = frame;
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment -- `codeFrameColumns` type isn't defined.
      content: codeFrameColumns(
        source,
        {
          start: { column, lineNumber },
        },
        { highlightCode: true },
      ),
      location: { column, row: lineNumber },
      fileName: file,
    };
  } catch (error) {
    return null;
  }
};

export const symbolicateStackTrace = async (
  rawSourcemap: Uint8Array,
  stack: Frame[],
): Promise<SymbolicateResult> => {
  const sourcemapContent = Buffer.from(rawSourcemap).toString('utf-8');
  const sourcemapConsumer = await new SourceMapConsumer(sourcemapContent);

  const frames = stack
    // Filter files that served bundle from dev-server.
    .filter(({ file }) => file.startsWith('http'))
    .map((frame) => originalPositionFor(sourcemapConsumer, frame))
    .map(collapseFrame);

  return {
    stack: frames,
    codeFrame: getCodeFrame(sourcemapConsumer, frames),
  };
};
