import { type UuidAuthRequestHandler } from "../types";
import { UnauthorizedError } from "../../core/error";

export const uuidAuthMiddleware =
  (uuidToken: string): UuidAuthRequestHandler =>
  (req, _res, next) => {
    if (!req.headers.authorization) {
      next(new UnauthorizedError("No authorization token was found"));
      return;
    }

    const [schema, token, ...rest] = req.headers.authorization.split(" ");

    if (rest.length || schema !== "Bearer") {
      next(new UnauthorizedError("Format is Authorization: Bearer [token]"));
      return;
    }

    if (token !== uuidToken) {
      next(new UnauthorizedError("Invalid token"));
      return;
    }

    req.auth = {
      uuid: token,
    };

    next();
  };
