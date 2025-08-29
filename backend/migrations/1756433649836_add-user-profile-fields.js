export const up = (pgm) => {
    pgm.addColumns("users", {
        bio: { type: "text" },
        location: { type: "text" },
        joined_at: { type: "timestamp", default: pgm.func('now()') },
    });
};

export const down = (pgm) => {
    pgm.dropColumns("users", ["bio", "location", "joined_at"]);
};
