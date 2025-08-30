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
};

export const down = (pgm) => {
    pgm.dropTable("users");
};
