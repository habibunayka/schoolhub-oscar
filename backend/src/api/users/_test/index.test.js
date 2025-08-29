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

test("PATCH /users/me updates profile", async () => {
    let runCalled = false;
    __setDbMocks({
        run: async (sql, params) => {
            runCalled = true;
            assert.match(sql, /UPDATE users SET/);
            assert.deepEqual(params, ["New Name", "Bio", "Loc", "avatar.png", 1]);
            return { rowCount: 1 };
        },
        get: async () => ({
            id: 1,
            name: "New Name",
            role_global: "student",
            avatar_url: "avatar.png",
            bio: "Bio",
            location: "Loc",
            joined_at: null,
        }),
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/users/me`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "New Name",
            bio: "Bio",
            location: "Loc",
            avatar_url: "avatar.png",
        }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, "New Name");
    assert(runCalled);
    server.close();
    __setDbMocks({ run: async () => ({ rowCount: 0 }), get: async () => null });
});
