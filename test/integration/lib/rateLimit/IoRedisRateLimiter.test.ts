import { randomUUID } from "crypto";
import { ioRedisClient } from "../../../../src/compositionRoot";
import { IoRedisRateLimiter } from "../../../../src/lib/rateLimit/IoRedisRateLimiter";

beforeAll(async () => {
  await ioRedisClient.connect();
});

afterAll(async () => {
  await ioRedisClient.close();
});

describe("IoRedisRateLimiter", () => {
  describe("increment", () => {
    describe("When key it does not already exists", () => {
      test("Should create a key with the id and namespace, increment by one and add windowMs as expiration", async () => {
        const id = randomUUID();
        const namespace = "test";
        const windowMs = 10000;
        const limit = 10;

        const ioRedisRateLimiter = new IoRedisRateLimiter(
          ioRedisClient.client,
          {
            limit,
            namespace,
            windowMs,
          },
        );

        const result = await ioRedisRateLimiter.increment(id);
        const keyValue = await ioRedisClient.client.get(`${namespace}:${id}`);

        expect(result.success).toBe(true);
        expect(result.totalHits).toBe(1);
        expect(result.limitHits).toBe(limit);
        expect(result.msToExpire).toBe(windowMs);
        expect(keyValue).toBe("1");
      });
    });
  });

  describe("When key does already exists", () => {
    test("Should increment by one and not change the expiration", async () => {
      const id = randomUUID();
      const namespace = "test";
      const windowMs = 100000;

      const ioRedisRateLimiter = new IoRedisRateLimiter(ioRedisClient.client, {
        limit: 2,
        namespace,
        windowMs,
      });

      await ioRedisRateLimiter.increment(id);

      // Sleep a little to check if expiration it's not changed
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });

      const result = await ioRedisRateLimiter.increment(id);
      const keyValue = await ioRedisClient.client.get(`${namespace}:${id}`);

      expect(result.success).toBe(true);
      expect(result.totalHits).toBe(2);
      expect(result.msToExpire).toBeLessThan(windowMs);
      expect(keyValue).toBe("2");
    });
  });

  describe("When its incremented more times than limit", () => {
    test("Should return false success", async () => {
      const id = randomUUID();

      const ioRedisRateLimiter = new IoRedisRateLimiter(ioRedisClient.client, {
        limit: 2,
        namespace: "test",
        windowMs: 100000,
      });

      await ioRedisRateLimiter.increment(id);
      await ioRedisRateLimiter.increment(id);
      const result = await ioRedisRateLimiter.increment(id);

      expect(result.success).toBe(false);
    });
  });
});
