export const up = (pgm) => {
    pgm.createTable("events", {
        id: "id",
        club_id: {
            type: "integer",
            notNull: true,
            references: "clubs",
            onDelete: "cascade",
        },
        title: { type: "text", notNull: true },
        description: "text",
        location: "text",
        start_at: { type: "timestamp", notNull: true },
        end_at: { type: "timestamp", notNull: true },
        capacity: "integer",
        require_rsvp: { type: "boolean", default: true },
        visibility: {
            type: "text",
            default: "public",
            check: "visibility IN ('public','members','school')",
        },
    });

    pgm.createTable("event_rsvps", {
        id: "id",
        event_id: {
            type: "integer",
            notNull: true,
            references: "events",
            onDelete: "cascade",
        },
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        status: {
            type: "text",
            notNull: true,
            check: "status IN ('going','interested','declined')",
        },
        checked_in_at: "timestamp",
        checkin_code: "text",
    });
};

export const down = (pgm) => {
    pgm.dropTable("event_rsvps");
    pgm.dropTable("events");
};
