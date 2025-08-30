/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import api from "../../services/client.js";
import service from "../../services/announcements.js";
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

  test("list builds query", async () => {
    const res = await service.list({ page: 2, search: "hello" });
    assert.equal(res.url, "/announcements");
    assert.equal(res.params.offset, 10);
    assert.equal(res.params.search, "hello");
  });

  test("get uses path", async () => {
    const res = await service.get(3);
    assert.equal(res.url, "/announcements/3");
  });

  test("create posts only allowed fields", async () => {
    const payload = { title: "t", content_html: "c", extra: "x" };
    const res = await service.create(payload);
    assert.equal(res.method, "post");
    assert.deepEqual(JSON.parse(res.data), { title: "t", content_html: "c" });
  });

  test("update sends only allowed fields", async () => {
    const payload = { title: "t", content_html: "c", extra: "x" };
    const res = await service.update(2, payload);
    assert.equal(res.method, "put");
    assert.equal(res.url, "/announcements/2");
    assert.deepEqual(JSON.parse(res.data), { title: "t", content_html: "c" });
  });

  test("remove calls delete", async () => {
    const res = await service.remove(7);
    assert.equal(res.method, "delete");
    assert.equal(res.url, "/announcements/7");
  });
}
