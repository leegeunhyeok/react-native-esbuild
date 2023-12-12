import invariant from 'invariant';
import type { BundleResult, BuildTaskDelegate } from '../types';

export const createBuildTaskDelegate = (): BuildTaskDelegate => {
  let resolver: BuildTaskDelegate['success'] | undefined;
  let rejecter: BuildTaskDelegate['failure'] | undefined;

  const task = new Promise<BundleResult>((resolve, _reject) => {
    resolver = resolve;
    rejecter = (reason: Error) => {
      resolve({ result: null, error: reason });
    };
  });

  invariant(resolver, 'resolver is undefined');
  invariant(rejecter, 'rejecter is undefined');

  return { promise: task, success: resolver, failure: rejecter };
};
