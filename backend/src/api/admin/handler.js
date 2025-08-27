import { run } from "../../database/db.js";

export const takedown = async (req, res) => {
    const { entity_type, entity_id } = req.body;
    await run(`UPDATE ${entity_type} SET status = 'removed' WHERE id = $1`, [
        entity_id,
    ]);
    res.json({ ok: true });
};
