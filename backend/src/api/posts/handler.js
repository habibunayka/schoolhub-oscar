import { run, query } from "../../database/db.js";
import { cleanHTML } from "../../services/sanitize.js";

export const listPosts = (req, res) => {
    const clubId = Number(req.params.id);
    const rows = query(
        `SELECT p.*, 
                COALESCE(
                  json_group_array(
                    json_object('id', pa.id, 'file_url', pa.file_url)
                  ), '[]'
                ) AS attachments
         FROM posts p
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         WHERE p.club_id = ?
         GROUP BY p.id
         ORDER BY p.created_at DESC
         LIMIT 50`,
        [clubId]
    );
    res.json(rows);
};

export const getPostById = (req, res) => {
    const clubId = Number(req.params.id);
    const postId = Number(req.params.postId);
    const row = query(
        `SELECT p.*,
                COALESCE(
                  json_group_array(
                    json_object('id', pa.id, 'file_url', pa.file_url)
                  ), '[]'
                ) AS attachments
         FROM posts p
         LEFT JOIN post_attachments pa ON pa.post_id = p.id
         WHERE p.club_id = ? AND p.id = ?
         GROUP BY p.id
         LIMIT 1`,
        [clubId, postId]
    );
    if (!row || row.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json(row[0]);
};

export const createPost = (req, res) => {
    const clubId = Number(req.params.id);
    const { body_html, visibility = "public", pinned = 0 } = req.body;

    
    const r = run(
        `INSERT INTO posts(club_id, author_id, body_html, visibility, pinned) VALUES (?,?,?,?,?)`,
        [clubId, req.user.id, cleanHTML(body_html), visibility, pinned ? 1 : 0]
    );

    
    if (req.files && req.files.length > 10) {
        return res
            .status(400)
            .json({ message: "Maximum 10 attachments allowed" });
    }

    req.files?.forEach((file) => {
        run(
            `INSERT INTO post_attachments(post_id, file_url) VALUES (?, ?)`,
            [r.lastInsertRowid, `/uploads/${file.filename}`] 
        );
    });

    res.status(201).json({ id: r.lastInsertRowid });
};
