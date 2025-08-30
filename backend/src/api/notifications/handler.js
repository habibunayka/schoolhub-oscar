import { query, run } from "../../database/db.js";

export const listNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || "all";
        const type = req.query.type;

        const offset = (page - 1) * limit;

        let sqlQuery =
            "SELECT *, (read_at IS NOT NULL) as is_read FROM notifications WHERE user_id = $1";
        const queryParams = [req.user.id];
        let idx = 2;

        if (status === "read") {
            sqlQuery += ` AND read_at IS NOT NULL`;
        } else if (status === "unread") {
            sqlQuery += ` AND read_at IS NULL`;
        }

        if (type) {
            sqlQuery += ` AND type = $${idx++}`;
            queryParams.push(type);
        }

        sqlQuery += ` ORDER BY id DESC LIMIT $${idx++} OFFSET $${idx}`;
        queryParams.push(limit, offset);

        const rows = await query(sqlQuery, queryParams);
        for (const r of rows) {
            r.payload = r.payload_json;
            delete r.payload_json;
        }

        let countQuery =
            "SELECT COUNT(*) as total FROM notifications WHERE user_id = $1";
        const countParams = [req.user.id];
        let cidx = 2;

        if (status === "read") {
            countQuery += ` AND read_at IS NOT NULL`;
        } else if (status === "unread") {
            countQuery += ` AND read_at IS NULL`;
        }

        if (type) {
            countQuery += ` AND type = $${cidx++}`;
            countParams.push(type);
        }

        const countResult = await query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await run(
            `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );
        res.json({ ok: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAllRead = async (req, res) => {
    try {
        await run(
            `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
            [req.user.id]
        );
        res.json({ ok: true });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
