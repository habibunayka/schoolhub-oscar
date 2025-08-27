import { query } from "../../database/db.js";

export const listNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || "all";
        const type = req.query.type;

        const offset = (page - 1) * limit;

        let sqlQuery = `SELECT * FROM notifications WHERE user_id = $1`;
        const queryParams = [req.user.id];
        let idx = 2;

        if (status === "read") {
            sqlQuery += ` AND is_read = true`;
        } else if (status === "unread") {
            sqlQuery += ` AND is_read = false`;
        }

        if (type) {
            sqlQuery += ` AND type = $${idx++}`;
            queryParams.push(type);
        }

        sqlQuery += ` ORDER BY id DESC LIMIT $${idx++} OFFSET $${idx}`;
        queryParams.push(limit, offset);

        const rows = await query(sqlQuery, queryParams);

        let countQuery = `SELECT COUNT(*) as total FROM notifications WHERE user_id = $1`;
        const countParams = [req.user.id];
        let cidx = 2;

        if (status === "read") {
            countQuery += ` AND is_read = true`;
        } else if (status === "unread") {
            countQuery += ` AND is_read = false`;
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
