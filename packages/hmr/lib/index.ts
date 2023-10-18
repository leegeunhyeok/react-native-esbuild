import { PERFORM_REACT_REFRESH_SCRIPT } from './constants';

const getModuleBoundary = (id: string): string =>
  '//! ---------- {id} ---------- !//'.replace('{id}', id);

export const wrapModuleBoundary = (
  code: string,
  id: string,
  shouldPerformRefresh = false,
): string => {
  /**
   * To avoid strip comments
   * @see {@link https://esbuild.github.io/api/#legal-comments}
   */
  const __b = getModuleBoundary(id);
  const performRefresh = shouldPerformRefresh
    ? PERFORM_REACT_REFRESH_SCRIPT
    : '';

  return `${__b}\n${code}\n${performRefresh}\n${__b}`;
};

export const getModuleCodeFromBundle = (
  code: string,
  id: string,
): string | null => {
  const moduleBoundary = getModuleBoundary(id);
  const moduleStartAt = code.indexOf(moduleBoundary);
  if (moduleStartAt === -1) return null;

  let moduleEndAt = code
    .slice(moduleStartAt + moduleBoundary.length)
    .indexOf(moduleBoundary);
  if (moduleEndAt === -1) return null;

  moduleEndAt += moduleStartAt + moduleBoundary.length;

  // something wrong
  if (moduleStartAt >= moduleEndAt) return null;

  return code.slice(moduleStartAt, moduleEndAt).trim();
};

export const isReactRefreshRegistered = (code: string): boolean =>
  code.includes('$RefreshRuntime$');

export * from './server';
export * from './constants';
export type * from './types';
export type { HmrServer } from './server/HmrServer';
