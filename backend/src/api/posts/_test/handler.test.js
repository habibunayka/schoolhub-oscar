import test from "node:test";
import assert from "node:assert/strict";
import * as Posts from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("listPosts fetches posts for club", async () => {
    let params;
    __setDbMocks({
        query: async (sql, p) => {
            params = p;
            return [{ id: 1, images: "[]" }];
        },
    });
    const req = { params: { id: "2" } };
    let json;
    const res = { json: (d) => (json = d) };

    await Posts.listPosts(req, res);

    assert.deepEqual(json, [{ id: 1, images: "[]" }]);
    assert.deepEqual(params, [2]);
    __setDbMocks({ query: async () => [] });
});

test("getPostById returns 404 when missing", async () => {
    __setDbMocks({ query: async () => [] });
    const req = { params: { id: "2", postId: "5" } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Posts.getPostById(req, res);

    assert.equal(status, 404);
    assert.deepEqual(json, { message: "Post not found" });
});
