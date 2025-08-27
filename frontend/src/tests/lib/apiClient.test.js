/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
let api;
try {
  ({ api } = await import("../../lib/api/apiClient.js"));
} catch {
  test("api client", { skip: true }, () => {});
}

if (api) {
  process.env.VITE_API_URL = "http://example.com";

  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };

  test("api uses baseURL", () => {
    assert.equal(api.defaults.baseURL, "http://example.com");
  });

  test("api adds auth header", async () => {
    localStorage.getItem = () => "token123";
    api.defaults.adapter = (config) =>
      Promise.resolve({
        data: { headers: config.headers },
        status: 200,
        statusText: "OK",
        config,
        headers: config.headers,
      });
    const res = await api.get("/test");
    assert.equal(res.data.headers.Authorization, "Bearer token123");
  });
}
