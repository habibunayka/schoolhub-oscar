import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import { __setDbMocks } from "../../../database/db.js";

process.env.JWT_SECRET = "test";
const router = (await import("../index.js")).default;

async function createServer() {
    const app = express();
    app.use(express.json());
    app.use(router);
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const port = server.address().port;
    return { server, url: `http://localhost:${port}` };
}

test("GET /notifications returns data", async () => {
    let calls = 0;
    __setDbMocks({
        query: async (sql, params) => {
            calls++;
            if (sql.includes("COUNT")) return [{ total: 0 }];
            return [];
        },
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

    const { server, url } = await createServer();
    const res = await fetch(`${url}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body.data, []);
    assert.equal(calls, 2);

    server.close();
    __setDbMocks({ query: async () => [] });
});

test("GET /notifications with invalid limit triggers validation", async () => {
    let called = false;
    __setDbMocks({ query: async () => { called = true; return []; } });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

    const { server, url } = await createServer();
    const res = await fetch(`${url}/notifications?limit=-1`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 500);
    assert.equal(called, false);

    server.close();
    __setDbMocks({ query: async () => [] });
});

test("POST /notifications/read-all works", async () => {
    let called = false;
    __setDbMocks({
        run: async (sql, params) => {
            called = true;
            assert.ok(sql.includes("UPDATE notifications"));
            assert.equal(params[0], 1);
        },
        query: async () => [],
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/notifications/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    assert.equal(called, true);
    server.close();
    __setDbMocks({ run: async () => {}, query: async () => [] });
});
