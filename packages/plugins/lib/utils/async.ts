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
