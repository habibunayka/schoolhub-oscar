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

    // users
    const createUser = async (name, email, options = {}) => {
        const cols = ["name", "email", "password_hash"];
        const vals = [name, email, passwordHash];
        if (options.role_global) {
            cols.push("role_global");
            vals.push(options.role_global);
        }
        if (options.status) {
            cols.push("status");
            vals.push(options.status);
        }
        cols.push("avatar_url");
        vals.push(options.avatar_url);
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(",");
        const [{ id }] = await query(
            `INSERT INTO users (${cols.join(",")}) VALUES (${placeholders}) RETURNING id`,
            vals
        );
        return id;
    };

    const schoolAdminId = await createUser("School Admin", "admin@school.com", {
        role_global: "school_admin",
        avatar_url: "/uploads/avatar-school-admin.png",
    });
    const founderId = await createUser("Club Founder", "founder@example.com", {
        avatar_url: "/uploads/avatar-founder.png",
    });
    const clubAdminId = await createUser("Club Admin", "clubadmin@example.com", {
        avatar_url: "/uploads/avatar-clubadmin.png",
    });
    const memberId = await createUser("Club Member", "member@example.com", {
        avatar_url: "/uploads/avatar-member.png",
    });
    const guestId = await createUser("Guest User", "guest@example.com", {
        status: "guest",
        avatar_url: "/uploads/avatar-guest.png",
    });

    // club categories
    const [{ id: academicCatId }] = await query(
        "INSERT INTO club_categories (name) VALUES ($1) RETURNING id",
        ["Academic"]
    );
    const [{ id: sportsCatId }] = await query(
        "INSERT INTO club_categories (name) VALUES ($1) RETURNING id",
        ["Sports"]
    );
    const [{ id: artsCatId }] = await query(
        "INSERT INTO club_categories (name) VALUES ($1) RETURNING id",
        ["Arts"]
    );

    // clubs
    const [{ id: club1Id }] = await query(
        "INSERT INTO clubs (name, slug, description, logo_url, advisor_name, category_id, location) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [
            "Chess Club",
            "chess-club",
            "All about chess",
            "/uploads/logo-chess.png",
            "Mr. Smith",
            academicCatId,
            "Room 101",
        ]
    );
    const [{ id: club2Id }] = await query(
        "INSERT INTO clubs (name, slug, description, logo_url, advisor_name, category_id, location) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [
            "Music Club",
            "music-club",
            "We love music",
            "/uploads/logo-music.png",
            "Mrs. Johnson",
            artsCatId,
            "Auditorium",
        ]
    );

    // club members
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'owner','approved', NOW())",
        [club1Id, founderId]
    );
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'admin','approved', NOW())",
        [club1Id, clubAdminId]
    );
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'member','approved', NOW())",
        [club1Id, memberId]
    );
    await run(
        "INSERT INTO club_members (club_id, user_id, role, status, joined_at) VALUES ($1,$2,'owner','approved', NOW())",
        [club2Id, clubAdminId]
    );

    // posts
    const [{ id: post1Id }] = await query(
        "INSERT INTO posts (club_id, author_id, body_html) VALUES ($1,$2,$3) RETURNING id",
        [club1Id, founderId, "<p>Welcome to our club!</p>"]
    );
    const [{ id: post2Id }] = await query(
        "INSERT INTO posts (club_id, author_id, body_html) VALUES ($1,$2,$3) RETURNING id",
        [club2Id, clubAdminId, "<p>Music is life.</p>"]
    );

    await run(
        "INSERT INTO post_attachments (post_id, file_url) VALUES ($1,$2)",
        [post1Id, "/uploads/post-welcome.png"]
    );

    await run(
        "INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)",
        [post1Id, memberId]
    );
    await run(
        "INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)",
        [post2Id, founderId]
    );

    // events
    const now = new Date();
    const [{ id: event1Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
        [
            club1Id,
            "Chess Tournament",
            "Friendly tournament",
            "Hall A",
            now,
            new Date(now.getTime() + 2 * 60 * 60 * 1000),
            50,
            "https://example.com/event1.jpg",
        ]
    );
    const [{ id: event2Id }] = await query(
        "INSERT INTO events (club_id, title, description, location, start_at, end_at, capacity, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
        [
            club2Id,
            "Music Concert",
            "Enjoy music",
            "Hall B",
            now,
            new Date(now.getTime() + 3 * 60 * 60 * 1000),
            100,
            "https://example.com/event2.jpg",
        ]
    );

    await run(
        "INSERT INTO event_rsvps (event_id, user_id, status) VALUES ($1,$2,'going')",
        [event1Id, founderId]
    );
    await run(
        "INSERT INTO event_rsvps (event_id, user_id, status) VALUES ($1,$2,'going')",
        [event2Id, clubAdminId]
    );

    // announcements
    await run(
        "INSERT INTO announcements (club_id, title, content_html, target, scheduled_at, sent_at) VALUES (NULL,$1,$2,$3,NOW(),NOW())",
        ["Welcome", "<p>Welcome to the school!</p>", "all_school"]
    );

    console.log("Database seeded");
};

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
