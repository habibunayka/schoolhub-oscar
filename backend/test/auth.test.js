import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/server.js';
import { __setDbMocks } from '../src/database/db.js';
import argon2 from 'argon2';

process.env.JWT_SECRET = 'test';

test('login success', async () => {
  const hash = await argon2.hash('secret');
  __setDbMocks({ get: () => ({ id: 1, email: 'a@test.com', password_hash: hash, role_global: 'student', name: 'Alice' }) });
  const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'secret' });
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.token);
});

test('login invalid', async () => {
  __setDbMocks({ get: () => undefined });
  const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'bad' });
  assert.equal(res.statusCode, 401);
});
