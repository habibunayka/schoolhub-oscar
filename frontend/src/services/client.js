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
