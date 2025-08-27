import { run, query, tx } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const listPosts = async (req, res) => {
    const clubId = Number(req.params.id);
    const rows = await query(
        `SELECT p.*, 
                COALESCE(
                    json_agg(json_build_object('id', pa.id, 'file_url', pa.file_url)) FILTER (WHERE pa.id IS NOT NULL),
                    '[]'
                ) AS attachments
         FROM posts p
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         WHERE p.club_id = $1
         GROUP BY p.id
         ORDER BY p.created_at DESC
         LIMIT 50`,
        [clubId]
    );
    res.json(rows);
};

export const getPostById = async (req, res) => {
    const clubId = Number(req.params.id);
    const postId = Number(req.params.postId);
    const row = await query(
        `SELECT p.*, 
                COALESCE(
                    json_agg(json_build_object('id', pa.id, 'file_url', pa.file_url)) FILTER (WHERE pa.id IS NOT NULL),
                    '[]'
                ) AS attachments
         FROM posts p
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         WHERE p.club_id = $1 AND p.id = $2
         GROUP BY p.id
         LIMIT 1`,
        [clubId, postId]
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
        return res.status(400).json({ message: "Maximum of 10 attachments allowed" });
    }

    const postId = await tx(async ({ run }) => {
        const { rows } = await run(
            `INSERT INTO posts(club_id, author_id, body_html, visibility, pinned) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            [clubId, req.user.id, cleanHTML(body_html), visibility, pinned]
        );
        const id = rows[0].id;

        for (const file of req.files || []) {
            await run(
                `INSERT INTO post_attachments(post_id, file_url) VALUES ($1,$2)`,
                [id, `/uploads/${file.filename}`]
            );
        }
        return id;
    });

    res.status(201).json({ id: postId });
};
