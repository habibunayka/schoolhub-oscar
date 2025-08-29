import { get, query, run, tx } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const listClubs = async (req, res) => {
    const { search = "", tag, day } = req.query; // tag/day future index
    const rows = await query(
        `SELECT c.*, COUNT(m.id) AS member_count
         FROM clubs c
         LEFT JOIN club_members m ON c.id = m.club_id AND m.status = 'approved'
         WHERE c.is_active = true AND c.name ILIKE $1
         GROUP BY c.id
         ORDER BY c.name`,
        [`%${search}%`]
    );
    res.json(rows);
};

export const getClub = async (req, res) => {
    const id = Number(req.params.id);
    const row = await get(
        `SELECT c.*, COUNT(m.id) AS member_count
         FROM clubs c
         LEFT JOIN club_members m ON c.id = m.club_id AND m.status = 'approved'
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
    );
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
};

export const createClub = async (req, res) => {
    const { name, slug, description, advisor_name } = req.body;
    const id = await tx(async ({ run }) => {
        const { rows } = await run(
            `INSERT INTO clubs(name, slug, description, advisor_name) VALUES ($1,$2,$3,$4) RETURNING id`,
            [name, slug, cleanHTML(description || ""), advisor_name]
        );
        const clubId = rows[0].id;
        await run(
            `INSERT INTO club_members(club_id, user_id, role, status, joined_at) VALUES ($1,$2,'owner','approved', NOW())`,
            [clubId, req.user.id]
        );
        return clubId;
    });
    res.status(201).json({ id });
};

export const patchClub = async (req, res) => {
    const id = Number(req.params.id);
    const club = await get(`SELECT * FROM clubs WHERE id = $1`, [id]);
    if (!club) return res.status(404).json({ message: "Not found" });
    const payload = req.body;
    await run(
        `UPDATE clubs SET name = COALESCE($1,name), slug = COALESCE($2,slug), description = COALESCE($3,description), logo_url = COALESCE($4,logo_url), banner_url = COALESCE($5,banner_url), advisor_name = COALESCE($6,advisor_name) WHERE id = $7`,
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

export const joinClub = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await run(
            `INSERT INTO club_members(club_id, user_id, role, status) VALUES ($1,$2,'member','pending')`,
            [id, req.user.id]
        );
    } catch {
        return res.status(409).json({ message: "Already requested or member" });
    }
    res.status(201).json({ status: "pending" });
};

export const setMemberStatus = async (req, res) => {
    const { userId } = req.params;
    const { decision } = req.body; // 'approved'|'rejected'
    await run(
        `UPDATE club_members SET status = $1, joined_at = CASE WHEN $1='approved' THEN NOW() ELSE joined_at END WHERE club_id = $2 AND user_id = $3`,
        [decision, Number(req.params.id), Number(userId)]
    );
    res.json({ ok: true });
};
