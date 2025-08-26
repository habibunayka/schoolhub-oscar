import test from "node:test";
import assert from "node:assert/strict";
import * as Posts from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("listPosts fetches posts for club", () => {
    let params;
    __setDbMocks({
        query: (sql, p) => {
            params = p;
            return [{ id: 1, attachments: "[]" }];
        },
    });
    const req = { params: { id: "2" } };
    let json;
    const res = { json: (d) => (json = d) };

    Posts.listPosts(req, res);

    assert.deepEqual(json, [{ id: 1, attachments: "[]" }]);
    assert.deepEqual(params, [2]);
    __setDbMocks({ query: () => [] });
});

test("getPostById returns 404 when missing", () => {
    __setDbMocks({ query: () => [] });
    const req = { params: { id: "2", postId: "5" } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    Posts.getPostById(req, res);

    assert.equal(status, 404);
    assert.deepEqual(json, { message: "Post not found" });
});
