import { query, run } from "../../database/db.js";

export const getMyAchievements = async (req, res) => {
    const userId = req.user.id;
    const rows = await query(
        `SELECT id, title, description, created_at
         FROM achievements WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    res.json(rows);
};

export const createAchievement = async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;
    await run(
        `UPDATE users SET activity_points = activity_points + 10 WHERE id = $1`,
        [userId]
    );
    const { rows } = await run(
        `INSERT INTO achievements(user_id, title, description) VALUES ($1,$2,$3) RETURNING id`,
        [userId, title, description]
    );
    res.status(201).json({ id: rows[0].id });
};
