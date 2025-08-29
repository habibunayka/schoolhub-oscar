/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import api from "../../services/client.js";
import service from "../../services/users.js";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

if (service) {
  api.defaults.adapter = (config) =>
    Promise.resolve({
      data: config,
      status: 200,
      statusText: "OK",
      headers: config.headers,
      config,
    });

  test("updateProfile patches payload", async () => {
    const payload = { name: "N", bio: "B" };
    const res = await service.updateProfile(payload);
    assert.equal(res.method, "patch");
    assert.equal(res.url, "/users/me");
    assert.deepEqual(JSON.parse(res.data), payload);
  });
}
