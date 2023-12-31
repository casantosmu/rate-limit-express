import { type Request, type Response } from "express";
import { errorMiddleware } from "../errorMiddleware";
import { RateLimitError, UnauthorizedError } from "../../../core/error";

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};

const req = {} as Request;
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const next = () => {};

describe("errorMiddleware", () => {
  describe("When called", () => {
    test("Should call logger error with a message and the received error", () => {
      const error = new Error("message");

      errorMiddleware(logger)(error, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(expect.any(String), error);
    });
  });

  describe("When called with error", () => {
    test("Should call response status with '500'", () => {
      const error = new Error("message");

      errorMiddleware(logger)(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test("Should call response json with 'internal server error' code and message", () => {
      const error = new Error("message");

      errorMiddleware(logger)(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        code: "internalServerError",
        message: "Something went wrong",
      });
    });
  });

  describe("When called with UnauthorizedError", () => {
    test("Should call response status with '401'", () => {
      const error = new UnauthorizedError("message");

      errorMiddleware(logger)(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    test("Should call response json with the error code and message", () => {
      const error = new UnauthorizedError("custom-message");

      errorMiddleware(logger)(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        code: error.code,
        message: error.message,
      });
    });
  });

  describe("When called with RateLimitError", () => {
    test("Should call response status with '429'", () => {
      const error = new RateLimitError("message");

      errorMiddleware(logger)(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(429);
    });

    test("Should call response json with the error code, message, limit and reset time", () => {
      const error = new RateLimitError("custom-message", 24, new Date());

      errorMiddleware(logger)(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        code: error.code,
        message: error.message,
        limit: error.limit,
        resetTime: error.resetTime,
      });
    });
  });
});
