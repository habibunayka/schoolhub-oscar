import { query, run } from "../../database/db.js";

export const listCategories = async (req, res) => {
    const { withClubs } = req.query;
    let sql = "SELECT id, name FROM club_categories ORDER BY name";
    if (withClubs) {
        sql = `SELECT cat.id, cat.name, COUNT(c.id) AS club_count
               FROM club_categories cat
               LEFT JOIN clubs c ON c.category_id = cat.id
               GROUP BY cat.id
               HAVING COUNT(c.id) > 0
               ORDER BY cat.name`;
    }
    const rows = await query(sql);
    res.json(rows);
};

export const createCategory = async (req, res) => {
    const { name } = req.body;
    const { rows } = await run(
        `INSERT INTO club_categories(name) VALUES ($1) RETURNING id`,
        [name]
    );
    res.status(201).json({ id: rows[0].id });
};

export const patchCategory = async (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;
    await run(`UPDATE club_categories SET name = COALESCE($1,name) WHERE id = $2`, [name, id]);
    res.json({ updated: true });
};

export const deleteCategory = async (req, res) => {
    const id = Number(req.params.id);
    await run(`DELETE FROM club_categories WHERE id = $1`, [id]);
    res.json({ deleted: true });
};
