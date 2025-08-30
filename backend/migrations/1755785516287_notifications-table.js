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

    pgm.createIndex("notifications", ["user_id", "read_at"], {
        name: "idx_notifications_user_id_read_at",
    });
};

export const down = (pgm) => {
    pgm.dropTable("notifications");
};
