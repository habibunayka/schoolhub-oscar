export const up = (pgm) => {
    pgm.createTable("reports", {
        id: "id",
        reporter_id: {
            type: "integer",
            references: "users",
            onDelete: "set null",
        },
        entity_type: { type: "text", notNull: true },
        entity_id: { type: "integer", notNull: true },
        reason: "text",
        status: {
            type: "text",
            default: "open",
            check: "status IN ('open','resolved')",
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable("reports");
};
