import { env } from "./env";

export const tokenRateLimitConfig = {
  limit: env.rateLimiterTokenLimit,
  namespace: "rl",
  windowMs: 3600 * 1000,
};

export const ipRateLimitConfig = {
  limit: env.rateLimiterIpLimit,
  namespace: "rl",
  windowMs: 3600 * 1000,
};
