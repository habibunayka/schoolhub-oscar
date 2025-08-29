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

test("GET /users/me/stats returns data", async () => {
    __setDbMocks({
        get: async () => ({ activity_points: 10, achievements_count: 2 }),
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/users/me/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { activity_points: 10, achievements_count: 2 });
    server.close();
    __setDbMocks({ get: async () => null });
});
