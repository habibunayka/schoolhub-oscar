import test from "node:test";
import assert from "node:assert/strict";
import * as Clubs from "../handler.js";
import { __setDbMocks } from "../../../database/db.js";

test("listClubs queries database with search", async () => {
    let params;
    __setDbMocks({
        query: async (sql, p) => {
            params = p;
            return [{ id: 1 }];
        },
    });

    const req = { query: { search: "abc" } };
    let json;
    const res = { json: (d) => (json = d) };

    await Clubs.listClubs(req, res);

    assert.deepEqual(json, [{ id: 1 }]);
    assert.deepEqual(params, ["%abc%"]);
    __setDbMocks({ query: async () => [] });
});

test("createClub inserts club and membership", async () => {
    const calls = [];
    __setDbMocks({
        run: async (sql, params) => {
            calls.push({ sql, params });
            if (calls.length === 1) {
                return { rowCount: 1, rows: [{ id: 10 }] };
            }
            return { rowCount: 1, rows: [] };
        },
    });
    const req = {
        body: {
            name: "Club",
            slug: "club",
            description: "<p>hi</p>",
            advisor_name: "Mr X",
        },
        user: { id: 2 },
    };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Clubs.createClub(req, res);

    assert.equal(status, 201);
    assert.deepEqual(json, { id: 10 });
    assert.equal(calls.length, 2);
    assert.ok(calls[0].sql.includes("INSERT INTO clubs"));
    assert.equal(calls[1].params[0], 10);
    __setDbMocks({ run: async () => ({ rowCount: 0, rows: [] }) });
});

test("listMembers queries by club id", async () => {
    let params;
    __setDbMocks({
        query: async (sql, p) => {
            params = p;
            return [{ id: 1 }];
        },
    });

    const req = { params: { id: "7" } };
    let json;
    const res = { json: (d) => (json = d) };

    await Clubs.listMembers(req, res);

    assert.deepEqual(json, [{ id: 1 }]);
    assert.deepEqual(params, [7]);
    __setDbMocks({ query: async () => [] });
});

test("joinClub inserts membership", async () => {
    __setDbMocks({
        run: async () => ({ rowCount: 1, rows: [{ status: "pending" }] }),
    });
    const req = { params: { id: "3" }, user: { id: 2 } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Clubs.joinClub(req, res);

    assert.equal(status, 201);
    assert.deepEqual(json, { status: "pending" });
    __setDbMocks({ run: async () => ({ rowCount: 0, rows: [] }) });
});

test("joinClub returns existing status if already joined", async () => {
    __setDbMocks({
        run: async () => ({ rowCount: 0, rows: [] }),
        get: async () => ({ status: "approved" }),
    });
    const req = { params: { id: "3" }, user: { id: 2 } };
    let status, json;
    const res = {
        status: (c) => ((status = c), res),
        json: (d) => (json = d),
    };

    await Clubs.joinClub(req, res);

    assert.equal(status, 200);
    assert.deepEqual(json, { status: "approved" });
    __setDbMocks({
        run: async () => ({ rowCount: 0, rows: [] }),
        get: async () => undefined,
    });
});
