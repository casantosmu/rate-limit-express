import { env } from "./configs/env";
import { Server } from "./api/Server";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";
import { uuidAuthMiddleware } from "./api/middlewares/authMiddleware";
import { IoRedisClient } from "./db/IoRedisClient";
import {
  ipRateLimitMiddleware,
  uuidRateLimitMiddleware,
} from "./api/middlewares/rateLimitMiddleware";
import { IoRedisRateLimiter } from "./lib/rateLimit/IoRedisRateLimiter";

export const logger = console;

export const server = new Server(logger, {
  port: env.serverPort,
});

export const ioRedisClient = new IoRedisClient(logger, {
  host: env.redisHost,
  port: env.redisPort,
});

const uuidAuthMiddlewareHandler = uuidAuthMiddleware(env.uuidAuthToken);
export const provideUuidAuthMiddleware = () => uuidAuthMiddlewareHandler;

const errorMiddlewareHandler = errorMiddleware(console);
export const provideErrorMiddleware = () => errorMiddlewareHandler;

const uuidRateLimitMiddlewareHandler = uuidRateLimitMiddleware(
  new IoRedisRateLimiter(ioRedisClient.client, {
    limit: env.rateLimiterTokenLimit,
    namespace: "rl",
    windowMs: 3600 * 1000,
  }),
);
export const provideUuidRateLimitMiddleware = () =>
  uuidRateLimitMiddlewareHandler;

const ipRateLimitMiddlewareHandler = ipRateLimitMiddleware(
  new IoRedisRateLimiter(ioRedisClient.client, {
    limit: env.rateLimiterIpLimit,
    namespace: "rl",
    windowMs: 3600 * 1000,
  }),
);
export const provideIpRateLimitMiddleware = () => ipRateLimitMiddlewareHandler;
