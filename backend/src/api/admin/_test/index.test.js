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

test("PATCH /admin/takedown updates row", async () => {
    let called = false;
    __setDbMocks({ run: () => { called = true; } });
    const token = jwt.sign({ id: 1, role_global: "school_admin" }, process.env.JWT_SECRET);

    const { server, url } = await createServer();
    const res = await fetch(`${url}/admin/takedown`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entity_type: "users", entity_id: 1 }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });
    assert.equal(called, true);

    server.close();
    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});

test("PATCH /admin/takedown with invalid entity triggers validation", async () => {
    let called = false;
    __setDbMocks({ run: () => { called = true; } });
    const token = jwt.sign({ id: 1, role_global: "school_admin" }, process.env.JWT_SECRET);

    const { server, url } = await createServer();
    const res = await fetch(`${url}/admin/takedown`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entity_type: "invalid", entity_id: 1 }),
    });

    assert.equal(res.status, 500);
    assert.equal(called, false);

    server.close();
    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});
