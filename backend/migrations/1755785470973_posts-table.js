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
            notNull: true,
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

    pgm.createTable("post_attachments", {
        id: "id",
        post_id: {
            type: "integer",
            notNull: true,
            references: "posts",
            onDelete: "cascade",
        },
        file_url: { type: "text", notNull: true },
        created_at: {
            type: "timestamp",
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });

    pgm.addConstraint(
        "post_attachments",
        "max_10_attachments_per_post",
        "CHECK ((SELECT COUNT(*) FROM post_attachments pa WHERE pa.post_id = post_id) <= 10)"
    );
};

export const down = (pgm) => {
    pgm.dropTable("post_attachments");
    pgm.dropTable("posts");
};
