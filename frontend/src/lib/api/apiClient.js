import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((res) => res.data),
  register: (payload) =>
    api.post("/auth/register", payload).then((res) => res.data),
};

export default api;
