import test from "node:test";
import assert from "node:assert/strict";
import * as Notifications from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("listNotifications returns data and pagination", async () => {
    const rows = [{ id: 1 }];
    let calls = 0;
    __setDbMocks({
        query: async (sql, params) => {
            calls++;
            if (sql.includes("COUNT")) return [{ total: rows.length }];
            assert.ok(sql.includes("FROM notifications"));
            assert.equal(params[0], 1);
            return rows;
        },
    });
    const req = { user: { id: 1 }, query: {} };
    let json;
    const res = { json: (d) => (json = d), status: () => res };

    await Notifications.listNotifications(req, res);

    assert.deepEqual(json.data, rows);
    assert.equal(json.pagination.total, rows.length);
    assert.equal(calls, 2);
    __setDbMocks({ query: async () => [] });
});

test("markNotificationRead updates row", async () => {
    let called = false;
    __setDbMocks({
        run: async (sql, params) => {
            called = true;
            assert.ok(sql.includes("UPDATE notifications"));
            assert.equal(params[0], 1);
            assert.equal(params[1], 2);
        },
    });
    const req = { params: { id: 1 }, user: { id: 2 } };
    const res = { json: () => {}, status: () => res };
    await Notifications.markNotificationRead(req, res);
    assert.equal(called, true);
    __setDbMocks({ run: async () => {}, query: async () => [] });
});

test("markAllRead updates rows", async () => {
    let called = false;
    __setDbMocks({
        run: async (sql, params) => {
            called = true;
            assert.ok(sql.includes("UPDATE notifications"));
            assert.equal(params[0], 3);
        },
    });
    const req = { user: { id: 3 } };
    const res = { json: () => {}, status: () => res };
    await Notifications.markAllRead(req, res);
    assert.equal(called, true);
    __setDbMocks({ run: async () => {}, query: async () => [] });
});
