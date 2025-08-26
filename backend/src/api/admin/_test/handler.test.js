import test from "node:test";
import assert from "node:assert/strict";
import * as Admin from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("takedown updates entity", () => {
    let capturedSql, capturedParams;
    __setDbMocks({
        run: (sql, params) => {
            capturedSql = sql;
            capturedParams = params;
        },
    });

    const req = { body: { entity_type: "users", entity_id: 5 } };
    let json;
    const res = { json: (d) => (json = d) };

    Admin.takedown(req, res);

    assert.ok(capturedSql.includes("UPDATE users"));
    assert.deepEqual(capturedParams, [5]);
    assert.deepEqual(json, { ok: true });

    __setDbMocks({ run: () => ({ lastInsertRowid: 0 }) });
});
