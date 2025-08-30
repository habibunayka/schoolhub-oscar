import test from "node:test";
import assert from "node:assert/strict";
import {
    validateGetAllAnnouncements,
    validateCreateAnnouncement,
} from "../validator.js";
import { ValidationError } from "../../../exceptions/ValidationError.js";

async function run(middlewares, req) {
    for (const mw of middlewares) {
        await new Promise((resolve, reject) =>
            mw(req, {}, (err) => (err ? reject(err) : resolve()))
        );
    }
}

test("validateGetAllAnnouncements rejects negative limit", async () => {
    const req = { query: { limit: "-1" } };
    await assert.rejects(
        () => run(validateGetAllAnnouncements, req),
        ValidationError
    );
});

test("validateCreateAnnouncement requires fields", async () => {
    const req = { body: {} };
    await assert.rejects(
        () => run(validateCreateAnnouncement, req),
        ValidationError
    );
});

test("validateCreateAnnouncement passes with valid data", async () => {
    const req = {
        body: {
            title: "Title",
            content_html: "<p>Valid</p>",
        },
    };
    await run(validateCreateAnnouncement, req);
});


