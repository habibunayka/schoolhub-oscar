import { get, query, run } from "../../database/db.js";
import { nanoid } from "nanoid";

export const listEvents = (req, res) => {
    const clubId = Number(req.params.id);
    const rows = query(
        `SELECT * FROM events WHERE club_id = ? ORDER BY start_at`,
        [clubId]
    );
    res.json(rows);
};

export const createEvent = (req, res) => {
    const clubId = Number(req.params.id);
    const {
        title,
        description,
        location,
        start_at,
        end_at,
        capacity = null,
        require_rsvp = 1,
        visibility = "public",
    } = req.body;
    // TODO conflict checker (bentrok)
    const r = run(
        `INSERT INTO events(club_id, title, description, location, start_at, end_at, capacity, require_rsvp, visibility) VALUES (?,?,?,?,?,?,?,?,?)`,
        [
            clubId,
            title,
            description,
            location,
            start_at,
            end_at,
            capacity,
            require_rsvp ? 1 : 0,
            visibility,
        ]
    );
    res.status(201).json({ id: r.lastInsertRowid });
};

export const rsvpEvent = (req, res) => {
    const eventId = Number(req.params.id);
    const { status } = req.body; // status: "going" | "interested" | "declined"
    try {
        run(
            `INSERT INTO event_rsvps(event_id, user_id, status, checkin_code) VALUES (?,?,?,?)`,
            [eventId, req.user.id, status, nanoid(8)]
        );
    } catch {
        run(
            `UPDATE event_rsvps SET status = ? WHERE event_id = ? AND user_id = ?`,
            [status, eventId, req.user.id]
        );
    }
    res.json({ ok: true });
};

export const reviewEvent = (req, res) => {
    const eventId = Number(req.params.id);
    const { rating, comment } = req.body;
    const rsvp = get(
        `SELECT id FROM event_rsvps WHERE event_id = ? AND user_id = ?`,
        [eventId, req.user.id]
    );
    if (!rsvp) return res.status(403).json({ message: "RSVP required" });
    try {
        run(
            `INSERT INTO event_reviews(event_id, user_id, rating, comment) VALUES (?,?,?,?)`,
            [eventId, req.user.id, rating, comment]
        );
    } catch {
        run(
            `UPDATE event_reviews SET rating = ?, comment = ? WHERE event_id = ? AND user_id = ?`,
            [rating, comment, eventId, req.user.id]
        );
    }
    res.json({ ok: true });
};

export const checkinEvent = (req, res) => {
    const eventId = Number(req.params.id);
    const { code } = req.body;
    const row = get(
        `SELECT * FROM event_rsvps WHERE event_id = ? AND checkin_code = ?`,
        [eventId, code]
    );
    if (!row) return res.status(404).json({ message: "Invalid code" });
    run(`UPDATE event_rsvps SET checked_in_at = datetime('now') WHERE id = ?`, [
        row.id,
    ]);
    res.json({ ok: true });
};
