import { type Response, type Request, type NextFunction } from "express";
import { type RateLimiter } from "../../lib/rateLimit/type";
import { InternalError, RateLimitError } from "../../core/error";
import { type UuidAuthPayload, type AuthRequest } from "../types";

const getResetTime = (msToExpire: number) => {
  const nextRequest = new Date();
  nextRequest.setMilliseconds(nextRequest.getMilliseconds() + msToExpire);
  return nextRequest;
};

type Configs<RequestT> = {
  getKey: (req: RequestT) => string;
};

const rateLimitMiddleware =
  <RequestT = Request>(rateLimiter: RateLimiter, configs: Configs<RequestT>) =>
  async (req: RequestT, _res: Response, next: NextFunction) => {
    const key = configs.getKey(req);

    const incrementResult = await rateLimiter.increment(key);

    if (incrementResult.success) {
      next();
      return;
    }

    const resetTime = getResetTime(incrementResult.msToExpire);
    const error = new RateLimitError(
      "Request limit exceeded",
      incrementResult.limitHits,
      resetTime,
    );

    next(error);
  };

export const ipRateLimitMiddleware = (rateLimiter: RateLimiter) =>
  rateLimitMiddleware(rateLimiter, {
    getKey(req) {
      return req.ip;
    },
  });

export const uuidRateLimitMiddleware = (rateLimiter: RateLimiter) =>
  rateLimitMiddleware<AuthRequest<UuidAuthPayload>>(rateLimiter, {
    getKey(req) {
      if (!req.auth) {
        throw new InternalError(
          "Auth UUID is missing. Make sure to add the auth middleware before this middleware.",
        );
      }

      return req.auth.uuid;
    },
  });
