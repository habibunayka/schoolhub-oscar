import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function auth(optional = false) {
    return (req, res, next) => {
        const authz = req.headers.authorization || "";
        const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
        if (!token && optional) return next();
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        try {
            req.user = jwt.verify(token, env.JWT_SECRET);
            next();
        } catch {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}
