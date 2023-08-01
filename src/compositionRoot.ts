import { env } from "./configs/env";
import { redisConfig } from "./configs/redisConfig";
import {
  ipRateLimitConfig,
  tokenRateLimitConfig,
} from "./configs/rateLimitConfig";
import { serverConfig } from "./configs/serverConfig";
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

export const server = new Server(logger, serverConfig);

export const ioRedisClient = new IoRedisClient(logger, redisConfig);

const uuidAuthMiddlewareHandler = uuidAuthMiddleware(env.uuidAuthToken);
export const provideUuidAuthMiddleware = () => uuidAuthMiddlewareHandler;

const errorMiddlewareHandler = errorMiddleware(console);
export const provideErrorMiddleware = () => errorMiddlewareHandler;

const uuidRateLimitMiddlewareHandler = uuidRateLimitMiddleware(
  new IoRedisRateLimiter(ioRedisClient.client, tokenRateLimitConfig),
);
export const provideUuidRateLimitMiddleware = () =>
  uuidRateLimitMiddlewareHandler;

const ipRateLimitMiddlewareHandler = ipRateLimitMiddleware(
  new IoRedisRateLimiter(ioRedisClient.client, ipRateLimitConfig),
);
export const provideIpRateLimitMiddleware = () => ipRateLimitMiddlewareHandler;
