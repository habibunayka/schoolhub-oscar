export const up = (pgm) => {
    pgm.createIndex("events", ["club_id", "start_at"], {
        name: "idx_events_club_start",
    });

    pgm.createIndex("event_rsvps", ["event_id", "user_id"], {
        name: "idx_event_rsvps_unique",
        unique: true,
    });

    pgm.createIndex("club_members", ["club_id", "user_id"], {
        name: "idx_club_members_unique",
        unique: true,
    });

    pgm.createIndex("posts", ["club_id", "created_at"], {
        name: "idx_posts_club_created",
    });
};

export const down = (pgm) => {
    pgm.dropIndex("posts", ["club_id", "created_at"], {
        name: "idx_posts_club_created",
    });

    pgm.dropIndex("club_members", ["club_id", "user_id"], {
        name: "idx_club_members_unique",
    });

    pgm.dropIndex("event_rsvps", ["event_id", "user_id"], {
        name: "idx_event_rsvps_unique",
    });

    pgm.dropIndex("events", ["club_id", "start_at"], {
        name: "idx_events_club_start",
    });
};
