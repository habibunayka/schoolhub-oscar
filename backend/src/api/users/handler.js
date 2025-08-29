import { get } from "../../database/db.js";

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
