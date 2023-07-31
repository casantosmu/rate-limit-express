import request from "../request";

describe("GET /ping", () => {
  it("responds with 200", async () => {
    const response = await request.get("/v1/ping");

    expect(response.status).toBe(200);
  });
});
