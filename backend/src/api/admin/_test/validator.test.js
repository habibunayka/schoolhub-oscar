import test from "node:test";
import assert from "node:assert/strict";
import { validateTakedown } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateTakedown rejects unknown entity", async () => {
    const req = { body: { entity_type: "bad", entity_id: 1 } };
    await assert.rejects(() => run(validateTakedown, req), ValidationError);
});

test("validateTakedown passes with valid data", async () => {
    const req = { body: { entity_type: "users", entity_id: 1 } };
    await run(validateTakedown, req);
});
