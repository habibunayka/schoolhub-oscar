import fs from 'node:fs';

const routes = fs.readFileSync('src/routes.jsx', 'utf8');
const required = [
  '/login',
  'dashboard',
  'clubs',
  'clubs/:id',
  'events',
  'events/:id',
  'posts/:id',
  'announcements',
  'announcements/new',
  'announcements/:id',
  'announcements/:id/edit',
];

const missing = required.filter((p) => !routes.includes(p));
if (missing.length) {
  console.error(`Missing routes: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('All routes present');
