export const up = (pgm) => {
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

    pgm.createIndex("club_members", ["club_id", "user_id"], {
        name: "idx_club_members_club_id_user_id",
        unique: true,
    });
};

export const down = (pgm) => {
    pgm.dropTable("club_members");
};
