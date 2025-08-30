export const up = (pgm) => {
    pgm.createTable('post_likes', {
        id: 'id',
        post_id: {
            type: 'integer',
            notNull: true,
            references: 'posts',
            onDelete: 'cascade',
        },
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    });
    pgm.createIndex('post_likes', ['post_id', 'user_id'], { name: 'idx_post_likes_unique', unique: true });
};

export const down = (pgm) => {
    pgm.dropIndex('post_likes', ['post_id', 'user_id'], { name: 'idx_post_likes_unique' });
    pgm.dropTable('post_likes');
};
