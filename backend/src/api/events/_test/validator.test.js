import test from "node:test";
import assert from "node:assert/strict";
import { validateListEvents } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateListEvents rejects non-integer id", async () => {
    const req = { params: { id: "abc" } };
    await assert.rejects(() => run(validateListEvents, req), ValidationError);
});

test("validateListEvents passes with valid id", async () => {
    const req = { params: { id: "1" } };
    await run(validateListEvents, req);
});
