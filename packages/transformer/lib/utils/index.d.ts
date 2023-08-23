export declare const promisify: <Result>(task: (handler: (maybeError: unknown, result: Result) => void) => void) => Promise<Result>;
