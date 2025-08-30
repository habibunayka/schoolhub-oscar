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
    let avatarUrl;
    __setDbMocks({
        run: async (sql, params) => {
            runCalled = true;
            avatarUrl = params[3];
            assert.match(sql, /UPDATE users SET/);
            assert.equal(params[0], "New Name");
            assert.equal(params[1], "Bio");
            assert.equal(params[2], "Loc");
            assert.match(avatarUrl, /^\/uploads\//);
            return { rowCount: 1 };
        },
        get: async () => ({
            id: 1,
            name: "New Name",
            role_global: "student",
            avatar_url: avatarUrl,
            bio: "Bio",
            location: "Loc",
            joined_at: null,
        }),
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const form = new FormData();
    form.append("name", "New Name");
    form.append("bio", "Bio");
    form.append("location", "Loc");
    form.append("avatar", new Blob(["dummy"], { type: "image/png" }), "avatar.png");
    const res = await fetch(`${url}/users/me`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, "New Name");
    assert(body.avatar_url.startsWith("/uploads/"));
    assert(runCalled);
    server.close();
    __setDbMocks({ run: async () => ({ rowCount: 0 }), get: async () => null });
});

test("GET /users returns list", async () => {
    __setDbMocks({
        query: async (sql, params) => {
            assert.match(sql, /FROM users/);
            assert.equal(params[0], "%john%");
            return [{ id: 1, name: "John" }];
        },
    });
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { server, url } = await createServer();
    const res = await fetch(`${url}/users?search=john`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id: 1, name: "John" }]);
    server.close();
    __setDbMocks({ query: async () => [] });
});
