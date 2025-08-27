const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.VITE_API_URL ||
  '';

export function buildUrl(path, params) {
  const url = new URL(path, API_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });
  }
  return url.toString();
}

export function buildQuery(params = {}, { page, limit, sort } = {}) {
  const q = { ...params };
  if (page != null) q.page = page;
  if (limit != null) q.limit = limit;
  if (sort) q.sort = sort;
  return q;
}

function mapError(res, data) {
  if (!res) return { message: 'Network error', type: 'network' };
  if (res.status === 400) return { message: data?.message || 'Validation error', type: 'validation', details: data };
  if (res.status >= 500) return { message: data?.message || 'Server error', type: 'server' };
  return { message: data?.message || 'Request failed', type: 'unknown' };
}

export async function apiClient(
  path,
  { method = 'GET', params, body, headers = {}, retry = true, page, limit, sort } = {},
) {
  const url = buildUrl(path, buildQuery(params, { page, limit, sort }));
  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: { ...headers },
    credentials: 'include',
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  let res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    const err = new Error('Network error');
    err.type = 'network';
    throw err;
  }
  if (res.status === 401 && retry) {
    localStorage.removeItem('token');
    return apiClient(path, { method, params, body, headers, retry: false, page, limit, sort });
  }
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const mapped = mapError(res, data);
    const err = new Error(mapped.message);
    err.type = mapped.type;
    if (mapped.details) err.details = mapped.details;
    throw err;
  }
  return data;
}

export function toFormData(obj) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((val) => fd.append(k, val));
    else if (v !== undefined && v !== null) fd.append(k, v);
  });
  return fd;
}

export const authApi = {
  login: (email, password) => apiClient('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => apiClient('/auth/register', { method: 'POST', body: payload }),
};
