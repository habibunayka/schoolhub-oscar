export const up = (pgm) => {
    pgm.addColumn("notifications", {
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};

export const down = (pgm) => {
    pgm.dropColumn("notifications", "created_at");
};
