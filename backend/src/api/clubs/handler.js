import { get, query, run, tx } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const listClubs = async (req, res) => {
    const { search = "", membership } = req.query;
    const userId = req.user?.id;

    let membershipFilter = "";
    if (membership === "joined") {
        membershipFilter = userId
            ? "AND EXISTS (SELECT 1 FROM club_members cm WHERE cm.club_id = c.id AND cm.user_id = $2 AND cm.status = 'approved')"
            : "AND FALSE";
    } else if (membership === "recommended") {
        membershipFilter = userId
            ? "AND NOT EXISTS (SELECT 1 FROM club_members cm WHERE cm.club_id = c.id AND cm.user_id = $2 AND cm.status = 'approved')"
            : "";
    }

    const params = [`%${search}%`];
    let userJoin = "",
        groupExtra = "",
        membershipSelect = ", NULL AS membership_status, false AS is_member";
    if (userId) {
        params.push(userId);
        userJoin =
            "LEFT JOIN club_members me ON c.id = me.club_id AND me.user_id = $2";
        membershipSelect =
            ", me.status AS membership_status, CASE WHEN me.status = 'approved' THEN true ELSE false END AS is_member";
        groupExtra = ", me.id, me.status";
    }

    const rows = await query(
        `SELECT c.*, cat.name AS category_name, COUNT(m.id) AS member_count${membershipSelect}
         FROM clubs c
         LEFT JOIN club_categories cat ON c.category_id = cat.id
         LEFT JOIN club_members m ON c.id = m.club_id AND m.status = 'approved'
         ${userJoin}
         WHERE c.is_active = true AND c.name ILIKE $1 ${membershipFilter}
         GROUP BY c.id, cat.name${groupExtra}
         ORDER BY c.name`,
        params
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

export const listMembers = async (req, res) => {
    const id = Number(req.params.id);
    const rows = await query(
        `SELECT u.id, u.name, u.avatar_url, cm.role
         FROM club_members cm
         JOIN users u ON cm.user_id = u.id
         WHERE cm.club_id = $1 AND cm.status = 'approved'
         ORDER BY u.name`,
        [id]
    );
    res.json(rows);
};

export const listRequests = async (req, res) => {
    const id = Number(req.params.id);
    const rows = await query(
        `SELECT u.id, u.name, u.avatar_url
         FROM club_members cm
         JOIN users u ON cm.user_id = u.id
         WHERE cm.club_id = $1 AND cm.status = 'pending'
         ORDER BY u.name`,
        [id]
    );
    res.json(rows);
};

export const createClub = async (req, res) => {
    const { name, slug, description, advisor_name, category_id } = req.body;
    const id = await tx(async ({ run }) => {
        const { rows } = await run(
            `INSERT INTO clubs(name, slug, description, advisor_name, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            [name, slug, cleanHTML(description || ""), advisor_name, category_id]
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
        `UPDATE clubs SET name = COALESCE($1,name), slug = COALESCE($2,slug), description = COALESCE($3,description), logo_url = COALESCE($4,logo_url), banner_url = COALESCE($5,banner_url), advisor_name = COALESCE($6,advisor_name), category_id = COALESCE($7,category_id) WHERE id = $8`,
        [
            payload.name,
            payload.slug,
            payload.description ? cleanHTML(payload.description) : null,
            payload.logo_url,
            payload.banner_url,
            payload.advisor_name,
            payload.category_id,
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

export const leaveClub = async (req, res) => {
    const id = Number(req.params.id);
    const result = await run(
        `DELETE FROM club_members WHERE club_id = $1 AND user_id = $2`,
        [id, req.user.id]
    );
    if (result.rowCount === 0)
        return res.status(404).json({ message: "Not a member" });
    res.json({ left: true });
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
