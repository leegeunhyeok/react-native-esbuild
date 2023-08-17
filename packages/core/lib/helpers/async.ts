import type { PromiseHandler } from '../types';

type CallbackHandler<Result> = (maybeError: unknown, result: Result) => void;

export const promisify = <Result>(
  task: (handler: CallbackHandler<Result>) => void,
): Promise<Result> => {
  return new Promise<Result>((resolve, reject) => {
    task((maybeError, result) => {
      if (maybeError) {
        reject(maybeError);
      } else {
        resolve(result);
      }
    });
  });
};

export function createPromiseHandler<Result>(): PromiseHandler<Result> {
  let resolver: PromiseHandler<Result>['resolver'] | undefined;
  let rejecter: PromiseHandler<Result>['rejecter'] | undefined;

  const task = new Promise<Result>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  return { task, resolver, rejecter };
}
