import { type ErrorRequestHandler } from "express";
import { UnauthorizedError } from "../../core/error";
import { httpStatusCodes } from "../../lib/http/httpStatusCodes";
import { type Logger } from "../../lib/logger/types";

export const errorMiddleware =
  (logger: Logger): ErrorRequestHandler =>
  (error, _req, res, _next) => {
    logger.error("Error middleware received an error", error);

    if (error instanceof UnauthorizedError) {
      res.status(httpStatusCodes.unauthorized).json({
        code: error.code,
        message: error.message,
      });

      return;
    }

    res.status(httpStatusCodes.internalServerError).json({
      code: "internalServerError",
      message: "Something went wrong",
    });
  };
