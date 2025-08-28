export const up = (pgm) => {
    pgm.createTable("announcements", {
        id: "id",
        club_id: {
            type: "integer",
            references: "clubs",
            onDelete: "set null",
        },
        title: { type: "text", notNull: true },
        content_html: { type: "text", notNull: true },
        target: {
            type: "text",
            notNull: true,
            check: "target IN ('members','all_school')",
        },
        status: { type: "text", default: "active" },
        scheduled_at: "timestamp",
        sent_at: "timestamp",
        created_at: {
            type: "timestamp",
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable("announcements");
};
