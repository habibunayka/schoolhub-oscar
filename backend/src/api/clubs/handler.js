import { get, query, run } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const listClubs = (req, res) => {
    const { search = "", tag, day } = req.query; // tag/day future index
    const rows = query(
        `SELECT * FROM clubs WHERE is_active = 1 AND name LIKE ? ORDER BY name`,
        [`%${search}%`]
    );
    res.json(rows);
};

export const createClub = (req, res) => {
    const { name, slug, description, advisor_name } = req.body;
    const r = run(
        `INSERT INTO clubs(name, slug, description, advisor_name) VALUES (?,?,?,?)`,
        [name, slug, cleanHTML(description || ""), advisor_name]
    );
    run(
        `INSERT INTO club_members(club_id, user_id, role, status, joined_at) VALUES (?,?,?,?, datetime('now'))`,
        [r.lastInsertRowid, req.user.id, "owner", "approved"]
    );
    res.status(201).json({ id: r.lastInsertRowid });
};

export const patchClub = (req, res) => {
    const id = Number(req.params.id);
    const club = get(`SELECT * FROM clubs WHERE id = ?`, [id]);
    if (!club) return res.status(404).json({ message: "Not found" });
    const payload = req.body;
    run(
        `UPDATE clubs SET name = COALESCE(?,name), slug = COALESCE(?,slug), description = COALESCE(?,description), logo_url = COALESCE(?,logo_url), banner_url = COALESCE(?,banner_url), advisor_name = COALESCE(?,advisor_name) WHERE id = ?`,
        [
            payload.name,
            payload.slug,
            payload.description ? cleanHTML(payload.description) : null,
            payload.logo_url,
            payload.banner_url,
            payload.advisor_name,
            id,
        ]
    );
    res.json({ updated: true });
};

export const joinClub = (req, res) => {
    const id = Number(req.params.id);
    try {
        run(
            `INSERT INTO club_members(club_id, user_id, role, status) VALUES (?,?, 'member','pending')`,
            [id, req.user.id]
        );
    } catch {
        return res.status(409).json({ message: "Already requested or member" });
    }
    res.status(201).json({ status: "pending" });
};

export const setMemberStatus = (req, res) => {
    const { userId } = req.params;
    const { decision } = req.body; // 'approved'|'rejected'
    run(
        `UPDATE club_members SET status = ?, joined_at = CASE WHEN ?='approved' THEN datetime('now') ELSE joined_at END WHERE club_id = ? AND user_id = ?`,
        [decision, decision, Number(req.params.id), Number(userId)]
    );
    res.json({ ok: true });
};
