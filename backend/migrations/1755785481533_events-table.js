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

    pgm.createIndex("events", ["club_id", "start_at"], {
        name: "idx_events_club_id_start_at",
    });
};

export const down = (pgm) => {
    pgm.dropTable("events");
};
