import util from "util";
import { type Redis } from "ioredis";
import { InternalError } from "../../core/error";
import { type RateLimiter } from "./type";

type Configs = {
  windowMs: number;
  limit: number;
  namespace: string;
};

export class IoRedisRateLimiter implements RateLimiter {
  constructor(
    private readonly redisClient: Redis,
    private readonly configs: Configs,
  ) {}

  async increment(id: string) {
    const key = this.getKey(id);
    const seconds = Math.round(this.configs.windowMs / 1000);

    const result = await this.redisClient
      .multi()
      .incr(key)
      .expire(key, seconds, "NX")
      .pttl(key)
      .exec();

    if (!result?.[0] || !result[1] || !result[2]) {
      throw new InternalError(
        `Unexpected result format: ${util.inspect(result)}`,
      );
    }

    const [incrementError, totalHits] = result[0];

    if (incrementError) {
      throw new InternalError("Error incrementing value", incrementError);
    }

    if (typeof totalHits !== "number") {
      throw new InternalError("Incremented value is not a number");
    }

    const [expirationError] = result[1];

    if (expirationError) {
      throw new InternalError("Error setting expiration time", expirationError);
    }

    const [timeToExpireError, msToExpire] = result[2];

    if (timeToExpireError) {
      throw new InternalError(
        "Error getting expiration time",
        timeToExpireError,
      );
    }

    if (typeof msToExpire !== "number") {
      throw new InternalError("Expiration time is not a number");
    }

    return {
      success: totalHits <= this.configs.limit,
      totalHits,
      limitHits: this.configs.limit,
      msToExpire,
    };
  }

  private getKey(key: string) {
    return `${this.configs.namespace}:${key}`;
  }
}
