import request from "../request";
import { env } from "../../../src/configs/env";
import { ioRedisClient } from "../../../src/compositionRoot";

beforeAll(async () => {
  await ioRedisClient.connect();
});

afterAll(async () => {
  await ioRedisClient.close();
});

describe("GET /public", () => {
  it("responds with 200", async () => {
    const response = await request.get("/v1/public");

    expect(response.status).toBe(200);
  });
});

describe("GET /protected", () => {
  describe("When the request contains a valid Authentication Bearer token", () => {
    test("should respond with status code 200", async () => {
      const validToken = env.uuidAuthToken;
      const expectedStatusCode = 200;

      const response = await request.get("/v1/protected", {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).toBe(expectedStatusCode);
    });
  });

  describe("When the request contains an invalid Authentication Bearer token", () => {
    test("should respond with status code 401", async () => {
      const invalidToken = "invalid_token";
      const expectedStatusCode = 401;

      const response = await request.get("/v1/protected", {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${invalidToken}`,
        },
      });

      expect(response.status).toBe(expectedStatusCode);
    });
  });
});
