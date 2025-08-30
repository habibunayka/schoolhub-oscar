export const up = (pgm) => {
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

    pgm.createIndex("event_rsvps", ["event_id", "user_id"], {
        name: "idx_event_rsvps_event_id_user_id",
        unique: true,
    });
};

export const down = (pgm) => {
    pgm.dropTable("event_rsvps");
};
