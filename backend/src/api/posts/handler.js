import { run, query, tx, get } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";
import { sendNotification } from "../../services/notifications.js";

export const listPosts = async (req, res) => {
    const clubId = Number(req.params.id);
    const userId = req.user?.id || 0;
    const rows = await query(
        `SELECT p.id, p.club_id, p.author_id, p.body_html, p.visibility, p.status, p.created_at, p.pinned,
                c.name AS club_name, c.logo_url AS club_image,
                u.name AS author_name, u.avatar_url AS author_avatar,
                COALESCE(json_agg(pa.file_url) FILTER (WHERE pa.id IS NOT NULL), '[]') AS images,
                COUNT(pl.id) AS likes_count,
                COALESCE(BOOL_OR(pl.user_id = $2), false) AS liked
         FROM posts p
         JOIN clubs c ON c.id = p.club_id
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         LEFT JOIN post_likes pl ON pl.post_id = p.id
         WHERE p.club_id = $1
         GROUP BY p.id, c.name, c.logo_url, u.name, u.avatar_url
         ORDER BY p.created_at DESC
         LIMIT 50`,
        [clubId, userId]
    );
    res.json(rows);
};

export const getPostById = async (req, res) => {
    const clubId = Number(req.params.id);
    const postId = Number(req.params.postId);
    const userId = req.user?.id || 0;
    const row = await query(
        `SELECT p.id, p.club_id, p.author_id, p.body_html, p.visibility, p.status, p.created_at, p.pinned,
                c.name AS club_name, c.logo_url AS club_image,
                u.name AS author_name, u.avatar_url AS author_avatar,
                COALESCE(json_agg(pa.file_url) FILTER (WHERE pa.id IS NOT NULL), '[]') AS images,
                COUNT(pl.id) AS likes_count,
                COALESCE(BOOL_OR(pl.user_id = $3), false) AS liked
         FROM posts p
         JOIN clubs c ON c.id = p.club_id
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         LEFT JOIN post_likes pl ON pl.post_id = p.id
         WHERE p.club_id = $1 AND p.id = $2
         GROUP BY p.id, c.name, c.logo_url, u.name, u.avatar_url
         LIMIT 1`,
        [clubId, postId, userId]
    );
    if (!row || row.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json(row[0]);
};

export const getPost = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.user?.id || 0;
    const row = await query(
        `SELECT p.id, p.club_id, p.author_id, p.body_html, p.visibility, p.status, p.created_at, p.pinned,
                c.name AS club_name, c.logo_url AS club_image,
                u.name AS author_name, u.avatar_url AS author_avatar,
                COALESCE(json_agg(pa.file_url) FILTER (WHERE pa.id IS NOT NULL), '[]') AS images,
                COUNT(pl.id) AS likes_count,
                COALESCE(BOOL_OR(pl.user_id = $2), false) AS liked
         FROM posts p
         JOIN clubs c ON c.id = p.club_id
         LEFT JOIN users u ON u.id = p.author_id
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         LEFT JOIN post_likes pl ON pl.post_id = p.id
         WHERE p.id = $1
         GROUP BY p.id, c.name, c.logo_url, u.name, u.avatar_url
         LIMIT 1`,
        [id, userId]
    );
    if (!row || row.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json(row[0]);
};

export const createPost = async (req, res) => {
    const clubId = Number(req.params.id);
    const { body_html, visibility = "public", pinned = false } = req.body;

    if (req.files && req.files.length > 10) {
        return res.status(400).json({ message: "Maximum of 10 images allowed" });
    }

    const extraImages = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images ? [req.body.images] : [];

    const postId = await tx(async ({ run }) => {
        const { rows } = await run(
            `INSERT INTO posts(club_id, author_id, body_html, visibility, pinned) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            [clubId, req.user.id, cleanHTML(body_html), visibility, pinned]
        );
        const id = rows[0].id;

        for (const url of extraImages) {
            await run(
                `INSERT INTO post_attachments(post_id, file_url) VALUES ($1,$2)`,
                [id, url]
            );
        }

        for (const file of req.files || []) {
            await run(
                `INSERT INTO post_attachments(post_id, file_url) VALUES ($1,$2)`,
                [id, `/uploads/${file.filename}`]
            );
        }
        return id;
    });

    // notify club members about new post
    try {
        const members = await query(
            `SELECT user_id FROM club_members WHERE club_id = $1 AND status = 'approved'`,
            [clubId]
        );
        const club = await get(`SELECT name FROM clubs WHERE id = $1`, [clubId]);
        const clubName = club?.name;
        const ids = members
            .map((m) => m.user_id)
            .filter((id) => id !== req.user.id);
        await sendNotification(ids, "post_created", {
            post_id: postId,
            club_id: clubId,
            club_name: clubName,
        });
    } catch (err) {
        console.error("failed to send post notifications", err);
    }

    res.status(201).json({ id: postId });
};

