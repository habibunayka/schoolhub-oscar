import test from "node:test";
import assert from "node:assert/strict";
import * as Announcements from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("getAllAnnouncements returns queried rows", async () => {
    const rows = [{ id: 1, title: "Hello" }];
    let called = false;
    __setDbMocks({
        query: (sql, params) => {
            called = true;
            assert.ok(sql.includes("FROM announcements"));
            assert.deepEqual(params, [50, 0]);
            return rows;
        },
    });

    const req = { query: {} };
    let json;
    const res = { json: (data) => (json = data) };

    await Announcements.getAllAnnouncements(req, res);

    assert.deepEqual(json, rows);
    assert.equal(called, true);
    __setDbMocks({ query: () => [] });
});

test("getAnnouncementById handles missing row", async () => {
    let getCalled = false;
    __setDbMocks({ get: async () => { getCalled = true; return undefined; } });

    const req = { params: { id: "99" } };
    let status, json;
    const res = {
        status: (code) => ((status = code), res),
        json: (data) => (json = data),
    };

    await Announcements.getAnnouncementById(req, res);

    assert.equal(status, 404);
    assert.deepEqual(json, { message: "Announcement not found" });
    assert.equal(getCalled, true);
    __setDbMocks({ get: async () => undefined });
});

test("createAnnouncement sanitizes HTML and inserts", async () => {
    let params;
    let runCalled = false;
    __setDbMocks({
        run: async (sql, p) => {
            runCalled = true;
            params = p;
            return { rowCount: 1, rows: [{ id: 7 }] };
        },
    });

    const req = {
        body: {
            club_id: 1,
            title: "Title",
            content_html: "<p>Hi<script></script></p>",
            target: "all",
        },
    };
    let status, json;
    const res = {
        status: (code) => ((status = code), res),
        json: (data) => (json = data),
    };

    await Announcements.createAnnouncement(req, res);

    assert.equal(status, 201);
    assert.deepEqual(json, { id: 7 });
    assert.equal(params[2], "<p>Hi</p>");
    assert.equal(runCalled, true);
    __setDbMocks({ run: async () => ({ rowCount: 0, rows: [] }) });
});

