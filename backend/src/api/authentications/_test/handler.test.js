import test from "node:test";
import assert from "node:assert/strict";
import * as Auth from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("login returns 401 when user not found", async () => {
    __setDbMocks({ get: async () => undefined });
    const req = { body: { email: "a@a.com", password: "pw" } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Auth.login(req, res);

    assert.equal(status, 401);
    assert.deepEqual(json, { message: "Invalid credentials" });
    __setDbMocks({ get: async () => undefined });
});

test("register hashes password and inserts", async () => {
    let params;
    __setDbMocks({
        run: async (sql, p) => {
            params = p;
            return { rowCount: 1, rows: [{ id: 5 }] };
        },
    });
    const req = {
        body: { name: "User", email: "u@e.com", password: "secret" },
    };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Auth.register(req, res);

    assert.equal(status, 201);
    assert.deepEqual(json, { id: 5 });
    assert.equal(params[0], "User");
    assert.equal(params[1], "u@e.com");
    assert.notEqual(params[2], "secret");
    __setDbMocks({ run: async () => ({ rowCount: 0, rows: [] }) });
});

test("me returns 404 when user is missing", async () => {
    let calls = 0;
    __setDbMocks({
        get: async () => {
            calls++;
            return undefined;
        },
    });

    const req = { user: { id: 1 } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Auth.me(req, res);

    assert.equal(calls, 1);
    assert.equal(status, 401);
    assert.deepEqual(json, { message: "Unauthorized" });
    __setDbMocks({ get: async () => undefined });
});

test("me returns user profile data", async () => {
    __setDbMocks({
        get: async (sql, params) => {
            if (sql.includes("FROM users")) {
                return {
                    id: params[0],
                    name: "User",
                    role_global: "member",
                    avatar_url: "a.png",
                    bio: "bio",
                    location: "loc",
                    joined_at: "2024-01-01",
                };
            }
            if (sql.includes("FROM club_members")) {
                return { club_id: 7 };
            }
            return undefined;
        },
    });

    const req = { user: { id: 3 } };
    let json;
    const res = { json: (d) => (json = d) };

    await Auth.me(req, res);

    assert.deepEqual(json, {
        id: 3,
        name: "User",
        role_global: "member",
        avatar_url: "a.png",
        bio: "bio",
        location: "loc",
        joined_at: "2024-01-01",
        club_id: 7,
    });
    __setDbMocks({ get: async () => undefined });
});
