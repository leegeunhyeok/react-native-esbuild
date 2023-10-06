import type { BundleResult, PromiseHandler } from '../../types';

export const createPromiseHandler = (): PromiseHandler<BundleResult> => {
  let resolver: PromiseHandler<BundleResult>['resolver'] | undefined;
  let rejecter: PromiseHandler<BundleResult>['rejecter'] | undefined;

  const task = new Promise<BundleResult>((resolve, _reject) => {
    resolver = resolve;
    rejecter = (reason: Error) => {
      resolve({ result: null, error: reason });
    };
  });

  return { task, resolver, rejecter };
};
