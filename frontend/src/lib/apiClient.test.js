import test from 'node:test';
import assert from 'node:assert';

process.env.VITE_API_URL = 'http://example.com';
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

test('apiClient builds url and returns data', async () => {
  const { apiClient } = await import('./apiClient.js');
  global.fetch = async (url, opts) => ({
    ok: true,
    status: 200,
    json: async () => ({ url, headers: opts.headers })
  });
  const res = await apiClient('/hello', { params: { a: 1 } });
  assert.equal(res.url, 'http://example.com/hello?a=1');
  assert.equal(res.headers['Content-Type'], undefined);
});

test('apiClient maps validation errors', async () => {
  const { apiClient } = await import('./apiClient.js');
  global.fetch = async () => ({
    ok: false,
    status: 400,
    json: async () => ({ message: 'Invalid', errors: { field: 'required' } })
  });
  await assert.rejects(
    () => apiClient('/x', { method: 'POST', body: {} }),
    (err) => err.type === 'validation' && err.message === 'Invalid'
  );
});
