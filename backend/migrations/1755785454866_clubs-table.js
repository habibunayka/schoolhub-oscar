export const up = (pgm) => {
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
};

export const down = (pgm) => {
    pgm.dropTable("clubs");
};
