import { type ErrorRequestHandler } from "express";
import { httpStatusCodes } from "../../lib/http/httpStatusCodes";
import { type Logger } from "../../lib/logger/types";

export const errorMiddleware =
  (logger: Logger): ErrorRequestHandler =>
  (error, _req, res, _next) => {
    logger.error("Error middleware received an error", error);

    res.status(httpStatusCodes.internalServerError).json({
      code: "internalServerError",
      message: "Something went wrong",
    });
  };
