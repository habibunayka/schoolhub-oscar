export const up = (pgm) => {
  pgm.createTable('post_comments', {
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
    body_html: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
  });
  pgm.createIndex('post_comments', 'post_id');
};

export const down = (pgm) => {
  pgm.dropIndex('post_comments', 'post_id');
  pgm.dropTable('post_comments');
};
