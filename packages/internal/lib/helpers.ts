import path from 'node:path';
import indent from 'indent-string';

export const resolveFromRoot = (
  targetPath: string,
  root = process.cwd(),
): string => {
  return require.resolve(targetPath, {
    paths: Array.from(
      new Set([
        // add current workspace directory to module resolution path.
        // improve for workspace projects (eg. monorepo)
        path.join(root, 'node_modules'),
        ...(require.main?.paths ?? []),
      ]),
    ).filter(Boolean),
  });
};

export const wrapWithIIFE = (body: string, filepath: string): string => `
// ${filepath}
(function (global) {
${indent(body, 2)}
})(typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
`;
