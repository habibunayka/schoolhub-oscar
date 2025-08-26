import { env } from "../config/env.js";

let db = null;
let query, get, run, tx;

if (process.env.NODE_ENV !== "test") {
    const Database = (await import("better-sqlite3")).default;
    db = new Database(env.DB_PATH, { fileMustExist: false });
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    query = (sql, params = []) => db.prepare(sql).all(params);
    get = (sql, params = []) => db.prepare(sql).get(params);
    run = (sql, params = []) => db.prepare(sql).run(params);
    tx = (fn) => db.transaction(fn)();
} else {
    query = () => [];
    get = () => undefined;
    run = () => ({ lastInsertRowid: 0 });
    tx = (fn) => fn();
}

export { db, query, get, run, tx };
export const __setDbMocks = (fns = {}) => {
    if (fns.query) query = fns.query;
    if (fns.get) get = fns.get;
    if (fns.run) run = fns.run;
    if (fns.tx) tx = fns.tx;
};
