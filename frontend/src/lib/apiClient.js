const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.VITE_API_URL ||
  '';

function buildUrl(path, params) {
  const url = new URL(path, API_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });
  }
  return url.toString();
}

export async function apiClient(path, { method = 'GET', params, body, headers = {}, retry = true } = {}) {
  const url = buildUrl(path, params);
  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401 && retry) {
    localStorage.removeItem('token');
    return apiClient(path, { method, params, body, headers, retry: false });
  }
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const authApi = {
  login: (email, password) => apiClient('/auth/login', { method: 'POST', body: { email, password } }),
};
