import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_URL
    : undefined) || process.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = globalThis.localStorage?.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // TODO: kalau ada refresh token, implement; kalau tidak, clear & redirect
      globalThis.localStorage?.removeItem("token");
      // optional: window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
