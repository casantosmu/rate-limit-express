import { type Request, type Response } from "express";
import { type AuthRequest, type UuidAuthPayload } from "../../types";
import {
  ipRateLimitMiddleware,
  uuidRateLimitMiddleware,
} from "../rateLimitMiddleware";
import { RateLimitError } from "../../../core/error";

const testCases = [
  {
    name: "uuidRateLimitMiddleware",
    middleware: uuidRateLimitMiddleware,
    request: {
      auth: {
        uuid: "uuid",
      },
    } as AuthRequest<UuidAuthPayload>,
    key: "uuid",
  },
  {
    name: "ipRateLimitMiddleware",
    middleware: ipRateLimitMiddleware,
    request: {
      ip: "ip",
    } as unknown as Request,
    key: "ip",
  },
];

testCases.forEach(({ name, key, middleware, request }) => {
  describe(`Middleware: ${name}`, () => {
    describe("When called with rate limiter", () => {
      test(`Should call 'increment' from rate limiter with the key: ${key}`, async () => {
        const res = {} as Response;
        const next = () => {};

        const rateLimiter = {
          increment: jest.fn().mockResolvedValueOnce({
            success: true,
          }),
        };

        await middleware(rateLimiter)(request, res, next);

        expect(rateLimiter.increment).toHaveBeenCalledWith(key);
      });
    });

    describe("When called with rate limiter and 'increments' returns success", () => {
      test("Should call 'next'", async () => {
        const res = {} as Response;
        const next = jest.fn();

        const rateLimiter = {
          increment: jest.fn().mockResolvedValueOnce({
            success: true,
          }),
        };

        await middleware(rateLimiter)(request, res, next);

        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("When called with rate limiter and 'increments' does not return success", () => {
      test("Should call 'next' with RateLimitError", async () => {
        const res = {} as Response;
        const next = jest.fn();

        const rateLimiter = {
          increment: jest.fn().mockResolvedValueOnce({
            success: false,
          }),
        };

        await middleware(rateLimiter)(request, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(RateLimitError));
      });
    });
  });
});
