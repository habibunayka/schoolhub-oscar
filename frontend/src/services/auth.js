import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(endpoints.authentications.map((e) => [e.name, e]));

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} `{ token, user }`
 */
export const login = async (email, password) => {
  try {
    const { data } = await api.post(
      map.login.path,
      JSON.stringify({ email, password }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  } catch (err) {
    err.userMessage = err.response?.data?.message;
    throw err;
  }
};

/**
 * Register new user
 * @param {{ name:string, email:string, password:string }} payload
 * @returns {Promise<object>}
 */
export const register = async (payload) => {
  try {
    const { data } = await api.post(
      map.register.path,
      JSON.stringify(payload),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  } catch (err) {
    err.userMessage = err.response?.data?.message;
    throw err;
  }
};

/**
 * Logout user if backend supports it
 */
export const logout = async () => {
  const endpoint = map.logout?.path;
  if (endpoint) {
    try {
      await api.post(endpoint);
    } catch (_err) {
      // ignore logout errors
    }
  }
};


export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export default { login, register, logout, me };
