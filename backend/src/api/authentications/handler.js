import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { get, run } from "../../database/db.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const u = get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!u) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await argon2.verify(u.password_hash, password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
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
    const hash = await argon2.hash(password);
    try {
        const r = run(
            `INSERT INTO users(name, email, password_hash) VALUES (?,?,?)`,
            [name, email, hash]
        );
        res.status(201).json({ id: r.lastInsertRowid });
    } catch (e) {
        res.status(400).json({ message: "Email already used" });
    }
};
