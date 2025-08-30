import request from 'supertest';
import app from '../src/server.js';

describe('server middleware and errors', () => {

  test('sets X-Powered-By header', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.headers['x-powered-by']).toBe('SchoolHub');
  });

  test('returns validation error', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad' });
    expect(res.statusCode).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('handles unexpected errors', async () => {
    const res = await request(app).get('/__error');
    expect(res.statusCode).toBe(500);
  });
});
