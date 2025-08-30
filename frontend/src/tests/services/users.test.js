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
    const payload = new FormData();
    payload.append("name", "N");
    payload.append("bio", "B");
    const res = await service.updateProfile(payload);
    assert.equal(res.method, "patch");
    assert.equal(res.url, "/users/me");
    assert.ok(res.data instanceof FormData);
  });
}
