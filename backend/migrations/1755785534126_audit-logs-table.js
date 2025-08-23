export const up = (pgm) => {
    pgm.createTable("audit_logs", {
        id: "id",
        actor_id: {
            type: "integer",
            references: "users",
            onDelete: "set null",
        },
        action: "text",
        entity_type: "text",
        entity_id: "integer",
        meta_json: "jsonb",
        created_at: {
            type: "timestamp",
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};

export const down = (pgm) => {
    pgm.dropTable("audit_logs");
};
