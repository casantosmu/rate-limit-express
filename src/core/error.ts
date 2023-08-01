export class AppError extends Error {
  constructor(
    readonly code: string,
    override readonly message: string,
    readonly cause?: Error,
  ) {
    super();
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, cause?: Error) {
    super("rateLimitError", message, cause);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, cause?: Error) {
    super("unauthorizedError", message, cause);
  }
}

export class InternalError extends AppError {
  constructor(message: string, cause?: Error) {
    super("internalError", message, cause);
  }
}
