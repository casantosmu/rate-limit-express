import { type Request, type Response } from "express";
import { errorMiddleware } from "../errorMiddleware";

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
});
