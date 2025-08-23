export const permitGlobal =
    (...roles) =>
    (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role_global)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };

import { get } from "../database/db.js";
export const permitClub =
    (...roles) =>
    (req, res, next) => {
        const clubId = Number(req.params.id || req.params.clubId);
        if (!req.user || !clubId)
            return res.status(400).json({ message: "Bad request" });
        const m = get(
            `SELECT role, status FROM club_members WHERE club_id = ? AND user_id = ?`,
            [clubId, req.user.id]
        );
        if (!m || m.status !== "approved" || !roles.includes(m.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
