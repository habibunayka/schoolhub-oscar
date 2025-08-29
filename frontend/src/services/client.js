import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_URL
    : undefined) || process.env.VITE_API_URL;

export const API_BASE_URL = 'http://localhost:3000';

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
    const url = err?.config?.url;
    if (status === 401 && url !== "/auth/login") {
      globalThis.localStorage?.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
    }
    err.userMessage = err?.response?.data?.message;
    return Promise.reject(err);
  }
);

export default api;
