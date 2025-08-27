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
    pgm.dropTable("posts");
};
