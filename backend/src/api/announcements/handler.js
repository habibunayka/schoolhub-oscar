import { get, query, run } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const getAllAnnouncements = async (req, res) => {
    const { club_id, target, limit = 50, offset = 0 } = req.query;

    let sql = `SELECT a.*, c.name as club_name
               FROM announcements a
               LEFT JOIN clubs c ON a.club_id = c.id
               WHERE a.status != 'removed'`;
    const params = [];
    let idx = 1;

    if (club_id) {
        sql += ` AND a.club_id = $${idx++}`;
        params.push(Number(club_id));
    }

    if (target) {
        sql += ` AND a.target = $${idx++}`;
        params.push(target);
    }

    sql += ` ORDER BY a.created_at DESC LIMIT $${idx++} OFFSET $${idx}`;
    params.push(Number(limit), Number(offset));

    const rows = await query(sql, params);
    res.json(rows);
};

export const getAnnouncementById = async (req, res) => {
    const id = Number(req.params.id);
    const row = await get(
        `SELECT a.*, c.name as club_name
         FROM announcements a
         LEFT JOIN clubs c ON a.club_id = c.id
         WHERE a.id = $1 AND a.status != 'removed'`,
        [id]
    );

    if (!row) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(row);
};

export const createAnnouncement = async (req, res) => {
    const { club_id, title, content_html, target } = req.body;
    const { rows } = await run(
        `INSERT INTO announcements(club_id, title, content_html, target) VALUES ($1,$2,$3,$4) RETURNING id`,
        [club_id, title, cleanHTML(content_html), target]
    );
    res.status(201).json({ id: rows[0].id });
};
