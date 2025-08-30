import argon2 from "argon2";
import { run, query } from "./db.js";

const seed = async () => {
    await run(`TRUNCATE TABLE
        event_reviews,
        notifications,
        post_likes,
        announcements,
        event_rsvps,
        events,
        post_attachments,
        posts,
        club_members,
        clubs,
        club_categories,
        users
        RESTART IDENTITY CASCADE`);

    const passwordHash = await argon2.hash("password123");
    const [{ id: user1Id }] = await query(
        "INSERT INTO users (name, email, password_hash, avatar_url) VALUES ($1,$2,$3,$4) RETURNING id",
        [
            "Alice",
            "alice@example.com",
            passwordHash,
            "/uploads/avatar-alice.png",
        ]
    );
    const [{ id: user2Id }] = await query(
        "INSERT INTO users (name, email, password_hash, avatar_url) VALUES ($1,$2,$3,$4) RETURNING id",
        ["Bob", "bob@example.com", passwordHash, "/uploads/avatar-bob.png"]
    );

    const [{ id: catSportsId }] = await query(
        "INSERT INTO club_categories (name) VALUES ($1) RETURNING id",
        ["Sports"]
    );
    const [{ id: catArtsId }] = await query(
        "INSERT INTO club_categories (name) VALUES ($1) RETURNING id",
        ["Arts"]
    );

    const [{ id: club1Id }] = await query(
        "INSERT INTO clubs (name, slug, description, logo_url, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING id",
        [
            "Chess Club",
            "chess-club",
            "All about chess",
            "/uploads/logo-chess.png",
            catSportsId,
        ]
    );
    const [{ id: club2Id }] = await query(
        "INSERT INTO clubs (name, slug, description, logo_url, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING id",
        ["Music Club", "music-club", "We love music", "/uploads/logo-music.png", catArtsId]
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
        [club1Id, user1Id, "<p>Welcome to our club!</p>"]
    );
    const [{ id: post2Id }] = await query(
        "INSERT INTO posts (club_id, author_id, body_html) VALUES ($1,$2,$3) RETURNING id",
        [club2Id, user2Id, "<p>Music is life.</p>"]
    );

    await run(
        "INSERT INTO post_attachments (post_id, file_url) VALUES ($1,$2)",
        [post1Id, "/uploads/post-welcome.png"]
    );

    await run(
        "INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)",
        [post1Id, user2Id]
    );
    await run(
        "INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)",
        [post2Id, user1Id]
    );

    const now = new Date();
    const [{ id: event1Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [
            club1Id,
            "Chess Tournament",
            "Friendly tournament",
            "Hall A",
            now,
            new Date(now.getTime() + 2 * 60 * 60 * 1000),
            50,
        ]
    );
    const [{ id: event2Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [
            club2Id,
            "Music Concert",
            "Enjoy music",
            "Hall B",
            now,
            new Date(now.getTime() + 3 * 60 * 60 * 1000),
            100,
        ]
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
        [club1Id, "Welcome", "<p>Welcome to the club!</p>", "members"]
    );

    console.log("Database seeded");
};

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
