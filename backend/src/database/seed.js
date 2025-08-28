import argon2 from "argon2";
import { run, query } from "./db.js";

const seed = async () => {
    await run(`TRUNCATE TABLE
        event_reviews,
        notifications,
        announcements,
        event_rsvps,
        events,
        post_attachments,
        posts,
        club_members,
        clubs,
        users
        RESTART IDENTITY CASCADE`);

    const passwordHash = await argon2.hash("password123");
    const [{ id: user1Id }] = await query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id",
        ["Alice", "alice@example.com", passwordHash]
    );
    const [{ id: user2Id }] = await query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id",
        ["Bob", "bob@example.com", passwordHash]
    );

    const [{ id: club1Id }] = await query(
        "INSERT INTO clubs (name, slug, description) VALUES ($1,$2,$3) RETURNING id",
        ["Chess Club", "chess-club", "All about chess"]
    );
    const [{ id: club2Id }] = await query(
        "INSERT INTO clubs (name, slug, description) VALUES ($1,$2,$3) RETURNING id",
        ["Music Club", "music-club", "We love music"]
    );

    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'owner','approved', NOW())",
        [club1Id, user1Id]
    );
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'member','approved', NOW())",
        [club1Id, user2Id]
    );
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'owner','approved', NOW())",
        [club2Id, user2Id]
    );

    const [{ id: post1Id }] = await query(
        "INSERT INTO posts (club_id, author_id, body_html) VALUES ($1,$2,$3) RETURNING id",
        [club1Id, user1Id, '<p>Welcome to our club!</p>']
    );
    await query(
        "INSERT INTO posts (club_id, author_id, body_html) VALUES ($1,$2,$3) RETURNING id",
        [club2Id, user2Id, '<p>Music is life.</p>']
    );

    await run(
        "INSERT INTO post_attachments (post_id, file_url) VALUES ($1,$2)",
        [post1Id, 'https://example.com/welcome.png']
    );

    const now = new Date();
    const [{ id: event1Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [club1Id, 'Chess Tournament', 'Friendly tournament', 'Hall A', now, new Date(now.getTime() + 2 * 60 * 60 * 1000), 50]
    );
    const [{ id: event2Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [club2Id, 'Music Concert', 'Enjoy music', 'Hall B', now, new Date(now.getTime() + 3 * 60 * 60 * 1000), 100]
    );

    await run(
        "INSERT INTO event_rsvps (event_id, user_id, status) VALUES ($1,$2,'going')",
        [event1Id, user1Id]
    );
    await run(
        "INSERT INTO event_rsvps (event_id, user_id, status) VALUES ($1,$2,'going')",
        [event2Id, user2Id]
    );

    await run(
        "INSERT INTO announcements (club_id, title, content_html, target, scheduled_at, sent_at) VALUES ($1,$2,$3,$4,NOW(),NOW())",
        [club1Id, 'Welcome', '<p>Welcome to the club!</p>', 'members']
    );
    await run(
        "INSERT INTO announcements (club_id, title, content_html, target, scheduled_at, sent_at) VALUES ($1,$2,$3,$4,NOW(),NOW())",
        [club2Id, 'Concert', '<p>Concert soon!</p>', 'members']
    );

    await run(
        "INSERT INTO notifications (user_id, type, payload_json) VALUES ($1,$2,$3)",
        [user1Id, 'info', { message: 'Notification for Alice' }]
    );
    await run(
        "INSERT INTO notifications (user_id, type, payload_json) VALUES ($1,$2,$3)",
        [user2Id, 'info', { message: 'Notification for Bob' }]
    );

    await run(
        "INSERT INTO event_reviews (event_id, user_id, rating, comment) VALUES ($1,$2,$3,$4)",
        [event1Id, user1Id, 5, 'Great event!']
    );
    await run(
        "INSERT INTO event_reviews (event_id, user_id, rating, comment) VALUES ($1,$2,$3,$4)",
        [event2Id, user2Id, 4, 'Nice music!']
    );

    console.log('Database seeded');
};

seed().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
});
