import path from 'node:path';
import {
  colors,
  type BuildContext,
  type ModuleId,
} from '@react-native-esbuild/shared';
import type { Metafile } from 'esbuild';
import { getReloadByDevSettingsProxy } from '@react-native-esbuild/internal';
import { HMR_REGISTER_FUNCTION, HMR_UPDATE_FUNCTION } from './constants';
import { logger } from './shared';

let INTERNAL_boundaryIndex = 0;

export const asHMRBoundary = (id: ModuleId, body: string): string => {
  const ident = `__hmr${INTERNAL_boundaryIndex++}`;
  return `var ${ident} = ${HMR_REGISTER_FUNCTION}(${JSON.stringify(id)});
  ${body}
  ${ident}.dispose(function () { });
  ${ident}.accept(function (payload) {
    global.__hmr.reactRefresh.performReactRefresh();
  });`;
};

/**
 * Make code that wrap body with HMR API's update callback.
 *
 * **example**
 * ```js
 * global.__hmr.update(id, function () {
 *   {body}
 * });
 * ```
 */
export const asHMRUpdateCall = (id: ModuleId, body: string): string => {
  return `${HMR_UPDATE_FUNCTION}(${JSON.stringify(id)}, function () {
    ${body}
  });`;
};

/**
 * Make code that wrap with try-catch block with fallback handler
 *
 * **example**
 * ```js
 * try {
 *   {body}
 * } catch (error) {
 *   console.error('[HMR] unable to accept', error);
 *   reload();
 * }
 * ```
 */
export const asFallbackBoundary = (body: string): string => {
  return `try {
    ${body}
  } catch (error) {
    console.error('[HMR] unable to accept', error);
    ${getReloadByDevSettingsProxy()}
  }`;
};

/**
 * Make code that register as external module.
 *
 * **example**
 * ```js
 * {body}
 * global.__modules.external(id, identName);
 * ```
 */
export const registerAsExternalModule = (
  id: ModuleId,
  body: string,
  identifierName: string,
): string => {
  return `${body}\nglobal.__modules.external(${JSON.stringify(
    id,
  )}, ${identifierName});`;
};

export const isHMRBoundary = (path: string): boolean => {
  return !path.includes('/node_modules/') && !path.endsWith('runtime.js');
};

/**
 * Get actual imported module path.
 */
export const getActualImportPaths = (
  buildContext: BuildContext,
  imports: Metafile['inputs'][string]['imports'],
): Record<string, string> => {
  const importPaths = imports.reduce(
    (prev, curr) => {
      // To avoid wrong assets path.
      // eg. `react-native-esbuild-assets:/path/to/assets`
      const splitted = path.resolve(buildContext.root, curr.path).split(':');
      const actualPath = splitted[splitted.length - 1];
      if (curr.original && !prev[curr.original]) {
        logger.debug(
          `${colors.gray(
            `├─ ${stripRoot(buildContext.root, curr.original)} ▸`,
          )} ${
            isExternal(
              buildContext.additionalData.externalPattern as string,
              curr.original,
            )
              ? colors.gray('<external>')
              : stripRoot(buildContext.root, actualPath)
          }`,
        );
      }
      return {
        ...prev,
        ...(curr.original ? { [curr.original]: actualPath } : null),
      };
    },
    {} as Record<string, string>,
  );

  logger.debug(colors.gray(`╰─ ${Object.keys(importPaths).length} import(s)`));

  return importPaths;
};

const stripRoot = (rootPath: string, path: string): string =>
  path.replace(new RegExp(`^${rootPath}/?`), '');

const isExternal = (pattern: string, path: string): boolean =>
  new RegExp(pattern).test(path);
