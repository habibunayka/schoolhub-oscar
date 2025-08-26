import test from "node:test";
import assert from "node:assert/strict";
import * as Auth from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("login returns 401 when user not found", async () => {
    __setDbMocks({ get: () => undefined });
    const req = { body: { email: "a@a.com", password: "pw" } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Auth.login(req, res);

    assert.equal(status, 401);
    assert.deepEqual(json, { message: "Invalid credentials" });
    __setDbMocks({ get: () => undefined });
});

test("register hashes password and inserts", async () => {
    let params;
    __setDbMocks({
        run: (sql, p) => {
            params = p;
            return { lastInsertRowid: 5 };
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
    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});
