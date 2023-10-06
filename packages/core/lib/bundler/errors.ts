export enum ReactNativeEsbuildErrorCode {
  BuildFailure = 'BuildFailure',
  InvalidTask = 'InvalidTask',
  Unknown = 'Unknown',
}

export class ReactNativeEsbuildError extends Error {
  constructor(
    message: string,
    public code = ReactNativeEsbuildErrorCode.Unknown,
  ) {
    super(message);
    this.name = 'ReactNativeEsbuildError';
    this.message = message;
  }
}
