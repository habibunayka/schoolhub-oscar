import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import router from "../index.js";
import { __setDbMocks } from "../../../database/db.js";

async function createServer() {
    const app = express();
    app.use(express.json());
    app.use(router);
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const port = server.address().port;
    return { server, url: `http://localhost:${port}` };
}

test("GET /clubs/:id/events returns rows", async () => {
    const rows = [{ id: 1 }];
    let called = false;
    __setDbMocks({
        query: () => {
            called = true;
            return rows;
        },
    });

    const { server, url } = await createServer();
    const res = await fetch(`${url}/clubs/1/events`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, rows);
    assert.equal(called, true);

    server.close();
    __setDbMocks({ query: () => [] });
});

test("GET /clubs/:id/events with invalid id triggers validation", async () => {
    let called = false;
    __setDbMocks({ query: () => { called = true; return []; } });

    const { server, url } = await createServer();
    const res = await fetch(`${url}/clubs/abc/events`);
    assert.equal(res.status, 500);
    assert.equal(called, false);

    server.close();
    __setDbMocks({ query: () => [] });
});
