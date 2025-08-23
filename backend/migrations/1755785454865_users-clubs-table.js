export const up = (pgm) => {
    pgm.createTable("users", {
        id: "id",
        name: { type: "text", notNull: true },
        email: { type: "text", notNull: true, unique: true },
        password_hash: { type: "text", notNull: true },
        role_global: {
            type: "text",
            default: "student",
            check: "role_global IN ('school_admin','student')",
        },
        avatar_url: "text",
        status: { type: "text", default: "active" },
    });

    pgm.createTable("clubs", {
        id: "id",
        name: { type: "text", notNull: true },
        slug: { type: "text", notNull: true, unique: true },
        description: "text",
        logo_url: "text",
        banner_url: "text",
        advisor_name: "text",
        is_active: { type: "boolean", default: true },
    });

    pgm.createTable("club_members", {
        id: "id",
        club_id: {
            type: "integer",
            notNull: true,
            references: "clubs",
            onDelete: "cascade",
        },
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        role: {
            type: "text",
            notNull: true,
            check: "role IN ('owner','admin','member')",
        },
        status: {
            type: "text",
            default: "pending",
            check: "status IN ('pending','approved','rejected')",
        },
        joined_at: "timestamp",
    });
};

export const down = (pgm) => {
    pgm.dropTable("club_members");
    pgm.dropTable("clubs");
    pgm.dropTable("users");
};
