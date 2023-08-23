export const promisify = <Result>(
  task: (handler: (maybeError: unknown, result: Result) => void) => void,
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
