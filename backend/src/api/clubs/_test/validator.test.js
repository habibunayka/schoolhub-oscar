import test from "node:test";
import assert from "node:assert/strict";
import { validateCreateClub } from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(mws, req) {
    for (const mw of mws) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateCreateClub rejects missing name", async () => {
    const req = { body: { slug: "club", advisor_name: "Mr" } };
    await assert.rejects(() => run(validateCreateClub, req), ValidationError);
});

test("validateCreateClub passes with valid data", async () => {
    const req = {
        body: {
            name: "Club",
            slug: "club",
            description: "desc",
            advisor_name: "Mr X",
        },
    };
    await run(validateCreateClub, req);
});
