import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { get, run } from "../../database/db.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const u = await get(
        `SELECT id, name, role_global, password_hash FROM users WHERE email = $1`,
        [email]
    );
    if (!u) return res.status(401).json({ message: "Invalid credentials" });
    if (!u.password_hash || !u.password_hash.startsWith("$argon2"))
        return res.status(500).json({ message: "Invalid credentials" });
    const ok = await argon2.verify(u.password_hash, password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    if (!env.JWT_SECRET)
        return res.status(500).json({ message: "JWT misconfigured" });
    const token = jwt.sign(
        { id: u.id, role_global: u.role_global, name: u.name },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.json({
        token,
        user: { id: u.id, name: u.name, role_global: u.role_global },
    });
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    try {
        const { rows } = await run(
            `INSERT INTO users(name, email, password_hash) VALUES ($1,$2,$3) RETURNING id`,
            [name, email, hash]
        );
        res.status(201).json({ id: rows[0].id });
    } catch (e) {
        res.status(400).json({ message: "Email already used" });
    }
};

export const me = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await get(
        `SELECT id, name, role_global, avatar_url, bio, location, joined_at FROM users WHERE id = $1`,
        [req.user.id]
    );

    if (!user) {
        // If the token references a non-existent user, treat it as unauthorized
        return res.status(401).json({ message: "Unauthorized" });
    }

    const club = await get(
        `SELECT club_id FROM club_members WHERE user_id = $1 AND role IN ('owner','admin') LIMIT 1`,
        [req.user.id]
    );

    res.json({
        id: user.id,
        name: user.name,
        role_global: user.role_global,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        joined_at: user.joined_at,
        club_id: club?.club_id || null,
    });
};
