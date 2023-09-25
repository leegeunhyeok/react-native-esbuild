import type { PromiseHandler } from '../../types';

export const createPromiseHandler = <Result>(): PromiseHandler<Result> => {
  let resolver: PromiseHandler<Result>['resolver'] | undefined;
  let rejecter: PromiseHandler<Result>['rejecter'] | undefined;

  const task = new Promise<Result>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  return { task, resolver, rejecter };
};
