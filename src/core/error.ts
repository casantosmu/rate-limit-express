export class AppError extends Error {
  constructor(
    readonly code: string,
    override readonly message: string,
    readonly cause?: Error,
  ) {
    super();
  }
}

export class UnauthorizedError extends AppError {}
