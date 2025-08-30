export const up = (pgm) => {
    pgm.createTable("posts", {
        id: "id",
        club_id: {
            type: "integer",
            notNull: true,
            references: "clubs",
            onDelete: "cascade",
        },

        author_id: {
            type: "integer",
            references: "users",
            onDelete: "set null",
        },
        body_html: { type: "text", notNull: true },
        visibility: {
            type: "text",
            default: "public",
            check: "visibility IN ('public','members','school')",
        },
        status: { type: "text", default: "active" },
        created_at: {
            type: "timestamp",
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
        pinned: { type: "boolean", default: false },
    });

    pgm.createIndex("posts", "club_id", { name: "idx_posts_club_id" });
    pgm.createIndex("posts", "created_at", { name: "idx_posts_created_at" });
    pgm.createIndex("posts", ["club_id", "created_at"], {
        name: "idx_posts_club_id_created_at",
    });
};

export const down = (pgm) => {
    pgm.dropTable("posts");
};
