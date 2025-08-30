import { get, query, run } from "../../database/db.js";
import { nanoid } from "nanoid";
import { sendNotification } from "../../services/notifications.js";

export const listEvents = async (req, res) => {
    const clubId = Number(req.params.id);
    const rows = await query(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         WHERE e.club_id = $1
         GROUP BY e.id, c.name
         ORDER BY e.start_at`,
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

export const getEvent = async (req, res) => {
    const id = Number(req.params.id);
    const row = await get(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         WHERE e.id = $1
         GROUP BY e.id, c.name
         LIMIT 1`,
        [id]
    );
    if (!row) return res.status(404).json({ message: "Event not found" });
    res.json(row);
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
    const eventId = rows[0].id;

    // notify club members about new event
    try {
        const members = await query(
            `SELECT user_id FROM club_members WHERE club_id = $1 AND status = 'approved'`,
            [clubId]
        );
        const club = await get(`SELECT name FROM clubs WHERE id = $1`, [clubId]);
        const ids = members
            .map((m) => m.user_id)
            .filter((id) => id !== req.user.id);
        await sendNotification(ids, "event_created", {
            event_id: eventId,
            event_title: title,
            club_id: clubId,
            club_name: club?.name,
        });
    } catch (err) {
        console.error("failed to send event notifications", err);
    }

    res.status(201).json({ id: eventId });
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
