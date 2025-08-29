import { get, query, run } from "../../database/db.js";
import { nanoid } from "nanoid";

export const listEvents = async (req, res) => {
    const clubId = Number(req.params.id);
    const rows = await query(
        `SELECT * FROM events WHERE club_id = $1 ORDER BY start_at`,
        [clubId]
    );
    res.json(rows);
};

export const listAllEvents = async (req, res) => {
    const rows = await query(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         GROUP BY e.id, c.name
         ORDER BY e.start_at`
    );
    res.json(rows);
};

export const createEvent = async (req, res) => {
    const clubId = Number(req.params.id);
    const {
        title,
        description,
        location,
        start_at,
        end_at,
        capacity = null,
        require_rsvp = true,
        visibility = "public",
    } = req.body;
    const { rows } = await run(
        `INSERT INTO events(club_id, title, description, location, start_at, end_at, capacity, require_rsvp, visibility) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [
            clubId,
            title,
            description,
            location,
            start_at,
            end_at,
            capacity,
            require_rsvp,
            visibility,
        ]
    );
    res.status(201).json({ id: rows[0].id });
};

export const rsvpEvent = async (req, res) => {
    const eventId = Number(req.params.id);
    const { status } = req.body; // status: "going" | "interested" | "declined"
    try {
        await run(
            `INSERT INTO event_rsvps(event_id, user_id, status, checkin_code) VALUES ($1,$2,$3,$4)`,
            [eventId, req.user.id, status, nanoid(8)]
        );
    } catch {
        await run(
            `UPDATE event_rsvps SET status = $1 WHERE event_id = $2 AND user_id = $3`,
            [status, eventId, req.user.id]
        );
    }
    res.json({ ok: true });
};

export const reviewEvent = async (req, res) => {
    const eventId = Number(req.params.id);
    const { rating, comment } = req.body;
    const rsvp = await get(
        `SELECT id FROM event_rsvps WHERE event_id = $1 AND user_id = $2`,
        [eventId, req.user.id]
    );
    if (!rsvp) return res.status(403).json({ message: "RSVP required" });
    try {
        await run(
            `INSERT INTO event_reviews(event_id, user_id, rating, comment) VALUES ($1,$2,$3,$4)`,
            [eventId, req.user.id, rating, comment]
        );
    } catch {
        await run(
            `UPDATE event_reviews SET rating = $1, comment = $2 WHERE event_id = $3 AND user_id = $4`,
            [rating, comment, eventId, req.user.id]
        );
    }
    res.json({ ok: true });
};

export const checkinEvent = async (req, res) => {
    const eventId = Number(req.params.id);
    const { code } = req.body;
    const row = await get(
        `SELECT * FROM event_rsvps WHERE event_id = $1 AND checkin_code = $2`,
        [eventId, code]
    );
    if (!row) return res.status(404).json({ message: "Invalid code" });
    await run(`UPDATE event_rsvps SET checked_in_at = NOW() WHERE id = $1`, [
        row.id,
    ]);
    res.json({ ok: true });
};
