import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import router from "../index.js";
import { __setDbMocks } from "../../../database/db.js";

async function createServer() {
    const app = express();
    app.use(express.json());
    app.use(router);
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const port = server.address().port;
    return { server, url: `http://localhost:${port}` };
}

test("POST /auth/register creates user", async () => {
    let called = false;
    __setDbMocks({ run: () => { called = true; return { lastInsertRowid: 1 }; } });

    const { server, url } = await createServer();
    const res = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "User", email: "u@e.com", password: "secret" }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.deepEqual(body, { id: 1 });
    assert.equal(called, true);

    server.close();
    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});

test("POST /auth/register with invalid data triggers validation", async () => {
    let called = false;
    __setDbMocks({ run: () => { called = true; return { lastInsertRowid: 2 }; } });

    const { server, url } = await createServer();
    const res = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "bad", password: "1" }),
    });

    assert.equal(res.status, 500);
    assert.equal(called, false);

    server.close();
    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});
