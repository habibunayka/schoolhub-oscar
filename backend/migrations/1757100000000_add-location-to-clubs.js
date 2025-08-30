export const up = (pgm) => {
    pgm.addColumn('clubs', {
        location: { type: 'text' }
    });
};

export const down = (pgm) => {
    pgm.dropColumn('clubs', 'location');
};
