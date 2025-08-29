import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import router from "../index.js";
import { __setDbMocks } from "../../../database/db.js";

process.env.JWT_SECRET = "test";

async function createServer() {
    const app = express();
    app.use(express.json());
    app.use(router);
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const port = server.address().port;
    return { server, url: `http://localhost:${port}` };
}

test("GET /achievements returns rows", async () => {
    __setDbMocks({
        query: async () => [{ id: 1, title: "Win", description: "Desc" }],
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id: 1, title: "Win", description: "Desc" }]);
    server.close();
    __setDbMocks({ query: async () => [] });
});

test("POST /achievements with invalid body triggers validation", async () => {
    let called = false;
    __setDbMocks({
        run: async () => {
            called = true;
            return { rows: [{ id: 1 }] };
        },
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/achievements`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "" }),
    });
    assert.equal(res.status, 500);
    assert.equal(called, false);
    server.close();
    __setDbMocks({ run: async () => ({ rows: [] }) });
});
