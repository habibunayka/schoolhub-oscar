import request from 'supertest';
import argon2 from 'argon2';
import app from '../src/server.js';
import { __setDbMocks } from '../src/database/db.js';

describe('POST /api/auth/login', () => {
  afterEach(() => __setDbMocks({ get: async () => undefined }));

  test('login success', async () => {
    const hash = await argon2.hash('secret');
    __setDbMocks({ get: () => ({ id: 1, email: 'a@test.com', password_hash: hash, role_global: 'student', name: 'Alice' }) });
    const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'secret' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('login invalid', async () => {
    __setDbMocks({ get: () => undefined });
    const res = await request(app).post('/api/auth/login').send({ email: 'a@test.com', password: 'bad' });
    expect(res.statusCode).toBe(401);
  });
});
