import test from "node:test";
import assert from "node:assert/strict";
import { loginValidator, registerValidator } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("registerValidator rejects short password", async () => {
    const req = { body: { name: "A", email: "a@a.com", password: "123" } };
    await assert.rejects(() => run(registerValidator, req), ValidationError);
});

test("loginValidator passes with valid data", async () => {
    const req = { body: { email: "a@a.com", password: "secret" } };
    await run(loginValidator, req);
});
