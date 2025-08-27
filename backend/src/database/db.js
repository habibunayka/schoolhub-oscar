import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

let query, get, run, tx;

if (process.env.NODE_ENV !== "test") {
    query = async (sql, params = []) => {
        const { rows } = await pool.query(sql, params);
        return rows;
    };

    get = async (sql, params = []) => {
        const { rows } = await pool.query(sql, params);
        return rows[0];
    };

    run = async (sql, params = []) => {
        const res = await pool.query(sql, params);
        return { rowCount: res.rowCount, rows: res.rows };
    };

    tx = async (fn) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const tquery = async (sql, params = []) => {
                const { rows } = await client.query(sql, params);
                return rows;
            };
            const tget = async (sql, params = []) => {
                const { rows } = await client.query(sql, params);
                return rows[0];
            };
            const trun = async (sql, params = []) => {
                const res = await client.query(sql, params);
                return { rowCount: res.rowCount, rows: res.rows };
            };

            const result = await fn({ query: tquery, get: tget, run: trun });
            await client.query("COMMIT");
            return result;
        } catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }
    };
} else {
    query = async () => [];
    get = async () => undefined;
    run = async () => ({ rowCount: 0, rows: [] });
    tx = async (fn) => fn({ query, get, run });
}

export { query, get, run, tx };
export const __setDbMocks = (fns = {}) => {
    if (fns.query) query = fns.query;
    if (fns.get) get = fns.get;
    if (fns.run) run = fns.run;
    if (fns.tx) tx = fns.tx;
};
