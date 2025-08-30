import { get, query, run } from "../../database/db.js";
import { nanoid } from "nanoid";
import { sendNotification } from "../../services/notifications.js";

export const listEvents = async (req, res) => {
    const clubId = Number(req.params.id);
    const rows = await query(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count,
                rsvp.status AS rsvp_status
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         LEFT JOIN event_rsvps rsvp ON rsvp.event_id = e.id AND rsvp.user_id = $2
         WHERE e.club_id = $1
         GROUP BY e.id, c.name, rsvp.status
         ORDER BY e.start_at`,
        [clubId, req.user?.id ?? null]
    );
    res.json(rows);
};

export const listAllEvents = async (req, res) => {
    const rows = await query(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count,
                rsvp.status AS rsvp_status
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         LEFT JOIN event_rsvps rsvp ON rsvp.event_id = e.id AND rsvp.user_id = $1
         GROUP BY e.id, c.name, rsvp.status
         ORDER BY e.start_at`,
        [req.user?.id ?? null]
    );
    res.json(rows);
};

export const getEvent = async (req, res) => {
    const id = Number(req.params.id);
    const row = await get(
        `SELECT e.*, c.name AS club_name, COUNT(r.id) AS participant_count,
                rsvp.status AS rsvp_status
         FROM events e
         JOIN clubs c ON e.club_id = c.id
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         LEFT JOIN event_rsvps rsvp ON rsvp.event_id = e.id AND rsvp.user_id = $2
         WHERE e.id = $1
         GROUP BY e.id, c.name, rsvp.status
         LIMIT 1`,
        [id, req.user?.id ?? null]
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
        image_url = null,
    } = req.body;
    const { rows } = await run(
        `INSERT INTO events(club_id, title, description, location, start_at, end_at, capacity, require_rsvp, visibility, image_url) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
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
            image_url,
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
    const row = await get(
        `SELECT COUNT(r.id) AS participant_count, rsvp.status AS rsvp_status
         FROM events e
         LEFT JOIN event_rsvps r ON r.event_id = e.id AND r.status = 'going'
         LEFT JOIN event_rsvps rsvp ON rsvp.event_id = e.id AND rsvp.user_id = $2
         WHERE e.id = $1
         GROUP BY rsvp.status`,
        [eventId, req.user.id]
    );
    res.json(row);
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

export const updateEvent = async (req, res) => {
    const eventId = Number(req.params.id);
    const event = await get(`SELECT club_id FROM events WHERE id = $1`, [eventId]);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.user.role_global !== "school_admin") {
        const member = await get(
            `SELECT role, status FROM club_members WHERE club_id = $1 AND user_id = $2`,
            [event.club_id, req.user.id]
        );
        if (
            !member ||
            member.status !== "approved" ||
            !["owner", "admin"].includes(member.role)
        ) {
            return res.status(403).json({ message: "Forbidden" });
        }
    }
    const current = await get(`SELECT * FROM events WHERE id = $1`, [eventId]);
    const {
        title = current.title,
        description = current.description,
        location = current.location,
        start_at = current.start_at,
        end_at = current.end_at,
        capacity = current.capacity,
        require_rsvp = current.require_rsvp,
        visibility = current.visibility,
        image_url = current.image_url,
    } = req.body;
    await run(
        `UPDATE events SET title=$1, description=$2, location=$3, start_at=$4, end_at=$5, capacity=$6, require_rsvp=$7, visibility=$8, image_url=$9 WHERE id=$10`,
        [
            title,
            description,
            location,
            start_at,
            end_at,
            capacity,
            require_rsvp,
            visibility,
            image_url,
            eventId,
        ]
    );
    res.json({ updated: true });
};

export const deleteEvent = async (req, res) => {
    const eventId = Number(req.params.id);
    const event = await get(`SELECT club_id FROM events WHERE id = $1`, [eventId]);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.user.role_global !== "school_admin") {
        const member = await get(
            `SELECT role, status FROM club_members WHERE club_id = $1 AND user_id = $2`,
            [event.club_id, req.user.id]
        );
        if (
            !member ||
            member.status !== "approved" ||
            !["owner", "admin"].includes(member.role)
        ) {
            return res.status(403).json({ message: "Forbidden" });
        }
    }

    await run(`DELETE FROM events WHERE id = $1`, [eventId]);
    res.json({ deleted: true });
};
