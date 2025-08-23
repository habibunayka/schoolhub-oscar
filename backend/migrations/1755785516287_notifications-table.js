export const up = (pgm) => {
    pgm.createTable("notifications", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        type: { type: "text", notNull: true },
        payload_json: { type: "jsonb", notNull: true },
        read_at: "timestamp",
    });
};

export const down = (pgm) => {
    pgm.dropTable("notifications");
};
