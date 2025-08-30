import { get, query, run } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";
import { sendNotification } from "../../services/notifications.js";

export const getAllAnnouncements = async (req, res) => {
    const { search, limit = 50, offset = 0 } = req.query;

    let sql =
        "SELECT a.* FROM announcements a WHERE a.status != 'removed' AND a.target = 'all_school'";
    const params = [];
    let idx = 1;

    if (search) {
        sql += ` AND (a.title ILIKE $${idx} OR a.content_html ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
    }

    sql += ` ORDER BY a.created_at DESC LIMIT $${idx++} OFFSET $${idx}`;
    params.push(Number(limit), Number(offset));

    const rows = await query(sql, params);
    res.json(rows);
};

export const getAnnouncementById = async (req, res) => {
    const id = Number(req.params.id);
    const row = await get(
        `SELECT a.* FROM announcements a WHERE a.id = $1 AND a.status != 'removed' AND a.target = 'all_school'`,
        [id]
    );

    if (!row) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(row);
};

export const createAnnouncement = async (req, res) => {
    const { title, content_html } = req.body;
    const { rows } = await run(
        `INSERT INTO announcements(title, content_html, target) VALUES ($1,$2,'all_school') RETURNING id`,
        [title, cleanHTML(content_html)]
    );
    const announcementId = rows[0].id;

    try {
        const users = await query(`SELECT id FROM users`);
        await sendNotification(
            users.map((u) => u.id),
            "school_announcement",
            { announcement_id: announcementId, title }
        );
    } catch (err) {
        console.error("failed to send announcement notifications", err);
    }

    res.status(201).json({ id: announcementId });
};

export const updateAnnouncement = async (req, res) => {
    const id = Number(req.params.id);
    const { title, content_html } = req.body;
    await run(
        `UPDATE announcements SET title = $1, content_html = $2 WHERE id = $3`,
        [title, cleanHTML(content_html), id]
    );
    res.json({ id });
};

export const deleteAnnouncement = async (req, res) => {
    const id = Number(req.params.id);
    await run(
        `UPDATE announcements SET status = 'removed' WHERE id = $1`,
        [id]
    );
    res.status(204).end();
};
