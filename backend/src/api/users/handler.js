import { get, run, query } from "../../database/db.js";

export const getMyStats = async (req, res) => {
    const id = req.user.id;
    const row = await get(
        `SELECT activity_points, (
            SELECT COUNT(*) FROM achievements WHERE user_id = $1
        ) AS achievements_count
        FROM users WHERE id = $1`,
        [id]
    );
    res.json(row || { activity_points: 0, achievements_count: 0 });
};

export const updateMe = async (req, res) => {
    const id = req.user.id;
    const { name, bio, location } = req.body;
    const avatar_url = req.file ? `/uploads/${req.file.filename}` : undefined;
    await run(
        `UPDATE users SET
            name = COALESCE($1, name),
            bio = COALESCE($2, bio),
            location = COALESCE($3, location),
            avatar_url = COALESCE($4, avatar_url)
        WHERE id = $5`,
        [name, bio, location, avatar_url, id]
    );
    const user = await get(
        `SELECT id, name, role_global, avatar_url, bio, location, joined_at FROM users WHERE id = $1`,
        [id]
    );
    res.json(user);
};

export const listUsers = async (req, res) => {
    const search = req.query.search ? `%${req.query.search}%` : "%";
    const rows = await query(
        `SELECT id, name FROM users WHERE name ILIKE $1 ORDER BY name LIMIT 20`,
        [search]
    );
    res.json(rows);
};
