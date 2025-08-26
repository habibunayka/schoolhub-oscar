export const up = (pgm) => {
    pgm.createTable("event_reviews", {
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
        rating: {
            type: "integer",
            notNull: true,
            check: "rating >= 1 AND rating <= 5",
        },
        comment: "text",
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("now()"),
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable("event_reviews");
};

