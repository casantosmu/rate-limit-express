import { type UuidAuthPayload, type AuthRequestHandler } from "../types";
import { UnauthorizedError } from "../../core/error";

class CredentialsRequiredError extends UnauthorizedError {
  constructor() {
    super("credentialsRequired", "No authorization token was found");
  }
}

class CredentialsBadSchemeError extends UnauthorizedError {
  constructor() {
    super("credentialsBadScheme", "Format is Authorization: Bearer [token]");
  }
}

class InvalidTokenError extends UnauthorizedError {
  constructor() {
    super("invalidToken", "Invalid token");
  }
}

export const uuidAuthMiddleware =
  (uuidToken: string): AuthRequestHandler<UuidAuthPayload> =>
  (req, _res, next) => {
    if (!req.headers.authorization) {
      next(new CredentialsRequiredError());
      return;
    }

    const [schema, token, ...rest] = req.headers.authorization.split(" ");

    if (rest.length || schema !== "Bearer") {
      next(new CredentialsBadSchemeError());
      return;
    }

    if (token !== uuidToken) {
      next(new InvalidTokenError());
      return;
    }

    req.auth = {
      uuid: token,
    };

    next();
  };
