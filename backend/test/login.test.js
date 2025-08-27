import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import authRoutes from '../src/api/authentications/index.js';
import { __setDbMocks } from '../src/database/db.js';
import argon2 from 'argon2';

async function createServer() {
  const app = express();
  app.use(express.json());
  app.use(authRoutes);
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const { port } = server.address();
  return { server, url: `http://localhost:${port}` };
}

test('POST /auth/login returns token', async () => {
  const hash = await argon2.hash('secret');
  __setDbMocks({ get: () => ({ id: 1, name: 'User', role_global: 'student', password_hash: hash }) });
  const { server, url } = await createServer();
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'u@e.com', password: 'secret' }),
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.token);
  server.close();
  __setDbMocks({ get: () => undefined });
});

test('POST /auth/login invalid credentials', async () => {
  __setDbMocks({ get: () => undefined });
  const { server, url } = await createServer();
  const res = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'u@e.com', password: 'bad' }),
  });
  assert.equal(res.status, 401);
  server.close();
});
