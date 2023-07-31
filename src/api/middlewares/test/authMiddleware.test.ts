import { type Response } from "express";
import { UnauthorizedError } from "../../../core/error";
import { uuidAuthMiddleware } from "../authMiddleware";
import { type AuthRequest, type UuidAuthPayload } from "../../types";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const next = jest.fn();

describe("uuidAuthMiddleware", () => {
  describe("When request header authorization token matches the received token", () => {
    test("Should add auth uuid token to request", () => {
      const validToken = "valid-token";
      const req = {
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      } as AuthRequest<UuidAuthPayload>;

      uuidAuthMiddleware(validToken)(req, res, next);

      expect(req.auth).toStrictEqual({
        uuid: validToken,
      });
    });

    test("Should call next", () => {
      const validToken = "valid-token";
      const req = {
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      } as AuthRequest<UuidAuthPayload>;

      uuidAuthMiddleware(validToken)(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("When request header authorization is empty", () => {
    test("Should call next with UnauthorizedError", () => {
      const req = {
        headers: {
          authorization: undefined,
        },
      } as AuthRequest<UuidAuthPayload>;

      uuidAuthMiddleware("")(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("When request header authorization is not using Bearer", () => {
    test("Should call next with UnauthorizedError", () => {
      const req = {
        headers: {
          authorization: "Basic 123",
        },
      } as AuthRequest<UuidAuthPayload>;

      uuidAuthMiddleware("")(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("When request header authorization token is different from the received token", () => {
    test("Should call next with UnauthorizedError", () => {
      const req = {
        headers: {
          authorization: "Bearer invalid-token",
        },
      } as AuthRequest<UuidAuthPayload>;

      uuidAuthMiddleware("valid-token")(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
