import test from "node:test";
import assert from "node:assert/strict";
import { validateListNotifications } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateListNotifications rejects negative limit", async () => {
    const req = { query: { limit: "-1" } };
    await assert.rejects(() => run(validateListNotifications, req), ValidationError);
});

test("validateListNotifications passes with valid query", async () => {
    const req = { query: { page: "1", limit: "10" } };
    await run(validateListNotifications, req);
});
