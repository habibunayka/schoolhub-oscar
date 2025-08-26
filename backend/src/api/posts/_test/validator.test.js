import test from "node:test";
import assert from "node:assert/strict";
import { validateCreatePost } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateCreatePost rejects missing body", async () => {
    const req = { params: { id: "1" }, body: {} };
    await assert.rejects(() => run(validateCreatePost, req), ValidationError);
});

test("validateCreatePost passes with valid data", async () => {
    const req = {
        params: { id: "1" },
        body: { body_html: "<p>Hi</p>" },
    };
    await run(validateCreatePost, req);
});
