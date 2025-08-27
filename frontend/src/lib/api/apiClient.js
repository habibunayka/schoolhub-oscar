import axios from "axios";

const api = axios.create({
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

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const messages = {
      400: "Bad request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not found",
      422: "Validation error",
      500: "Server error",
    };
    if (status === 401) {
      localStorage.removeItem("token");
    }
    error.userMessage =
      error.response?.data?.message || messages[status] || "Unexpected error";
    if (status === 422 && Array.isArray(error.response?.data?.errors)) {
      error.fieldErrors = error.response.data.errors;
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
