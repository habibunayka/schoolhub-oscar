import Database from "better-sqlite3";
import { env } from "../config/env.js";

export const db = new Database(env.DB_PATH, { fileMustExist: false });
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export const query = (sql, params = []) => db.prepare(sql).all(params);
export const get = (sql, params = []) => db.prepare(sql).get(params);
export const run = (sql, params = []) => db.prepare(sql).run(params);
export const tx = (fn) => db.transaction(fn)();
