import test from "node:test";
import assert from "node:assert/strict";
import * as Events from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("listEvents queries by club id", () => {
    let params;
    __setDbMocks({
        query: (sql, p) => {
            params = p;
            return [{ id: 1 }];
        },
    });
    const req = { params: { id: "5" } };
    let json;
    const res = { json: (d) => (json = d) };

    Events.listEvents(req, res);

    assert.deepEqual(json, [{ id: 1 }]);
    assert.deepEqual(params, [5]);
    __setDbMocks({ query: () => [] });
});
