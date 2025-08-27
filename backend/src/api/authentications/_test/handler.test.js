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
