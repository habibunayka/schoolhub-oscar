export const up = (pgm) => {
    pgm.createTable('club_categories', {
        id: 'id',
        name: { type: 'text', notNull: true, unique: true },
    });
    pgm.addColumn('clubs', {
        category_id: { type: 'integer', references: 'club_categories', onDelete: 'set null' },
    });
};

export const down = (pgm) => {
    pgm.dropColumn('clubs', 'category_id');
    pgm.dropTable('club_categories');
};
