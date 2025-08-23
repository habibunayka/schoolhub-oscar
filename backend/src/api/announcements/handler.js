import { get, query, run } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const getAllAnnouncements = (req, res) => {
    const { club_id, target, limit = 50, offset = 0 } = req.query;

    let sql = `SELECT a.*, c.name as club_name 
               FROM announcements a 
               LEFT JOIN clubs c ON a.club_id = c.id 
               WHERE a.status != 'removed'`;
    const params = [];

    if (club_id) {
        sql += ` AND a.club_id = ?`;
        params.push(Number(club_id));
    }

    if (target) {
        sql += ` AND a.target = ?`;
        params.push(target);
    }

    sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = query(sql, params);
    res.json(rows);
};

export const getAnnouncementById = (req, res) => {
    const id = Number(req.params.id);
    const row = get(
        `SELECT a.*, c.name as club_name 
         FROM announcements a 
         LEFT JOIN clubs c ON a.club_id = c.id 
         WHERE a.id = ? AND a.status != 'removed'`,
        [id]
    );

    if (!row) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(row);
};

export const createAnnouncement = (req, res) => {
    const { club_id, title, content_html, target } = req.body;
    const r = run(
        `INSERT INTO announcements(club_id, title, content_html, target) VALUES (?,?,?,?)`,
        [club_id, title, cleanHTML(content_html), target]
    );
    res.status(201).json({ id: r.lastInsertRowid });
};
