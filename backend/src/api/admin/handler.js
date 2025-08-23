import { run } from "../../database/db.js";

export const takedown = (req, res) => {
    const { entity_type, entity_id } = req.body;
    run(`UPDATE ${entity_type} SET status = 'removed' WHERE id = ?`, [
        entity_id,
    ]);
    res.json({ ok: true });
};
