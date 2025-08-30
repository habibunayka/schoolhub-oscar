export const up = (pgm) => {
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

    pgm.createIndex("post_attachments", "post_id", {
        name: "idx_post_attachments_post_id",
    });

    pgm.createFunction(
        "enforce_max_attachments_per_post",
        [],
        { returns: "trigger", language: "plpgsql" },
        `
    BEGIN
      IF (SELECT COUNT(*) FROM post_attachments WHERE post_id = NEW.post_id) >= 10 THEN
        RAISE EXCEPTION 'Max 10 attachments per post (post_id=%).', NEW.post_id
          USING ERRCODE = '23514';
      END IF;
      RETURN NEW;
    END;
    `
    );

    pgm.createTrigger("post_attachments", "trg_post_attachments_limit_ins", {
        when: "BEFORE",
        operation: "INSERT",
        level: "ROW",
        function: "enforce_max_attachments_per_post",
    });

    pgm.createTrigger("post_attachments", "trg_post_attachments_limit_upd", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "enforce_max_attachments_per_post",
        constraint: false,
        condition: "NEW.post_id IS DISTINCT FROM OLD.post_id",
    });
};

export const down = (pgm) => {
    pgm.dropTrigger("post_attachments", "trg_post_attachments_limit_upd");
    pgm.dropTrigger("post_attachments", "trg_post_attachments_limit_ins");
    pgm.dropFunction("enforce_max_attachments_per_post", [], {
        ifExists: true,
    });

    pgm.dropTable("post_attachments");
};
