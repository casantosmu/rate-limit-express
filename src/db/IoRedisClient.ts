import { Redis } from "ioredis";
import { type Logger } from "../lib/logger/types";

type Configurations = {
  port: number;
  host: string;
};

export class IoRedisClient {
  readonly client: Redis;

  constructor(
    private readonly logger: Logger,
    configurations: Configurations,
  ) {
    this.client = new Redis({
      lazyConnect: true,
      ...configurations,
    });
  }

  async connect() {
    await this.client.connect();
    this.logger.info("Connected to Redis");
  }

  async close() {
    await this.client.quit();
    this.logger.info("Redis connection closed");
  }
}
