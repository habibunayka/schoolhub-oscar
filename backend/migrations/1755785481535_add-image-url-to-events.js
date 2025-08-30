export const up = (pgm) => {
    pgm.addColumn("events", {
        image_url: { type: "text" },
    });
};

export const down = (pgm) => {
    pgm.dropColumn("events", "image_url");
};
