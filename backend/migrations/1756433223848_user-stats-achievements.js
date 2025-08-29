export const up = (pgm) => {
    pgm.addColumn("users", {
        activity_points: { type: "integer", notNull: true, default: 0 },
    });

    pgm.createTable("achievements", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        title: { type: "text", notNull: true },
        description: "text",
        created_at: { type: "timestamp", default: pgm.func('now()') },
    });
};

export const down = (pgm) => {
    pgm.dropTable("achievements");
    pgm.dropColumns("users", ["activity_points"]);
};
