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
  const { data } = await api.post(map.login.path, { email, password });
  return data;
};

/**
 * Register new user
 * @param {{ name:string, email:string, password:string }} payload
 * @returns {Promise<object>}
 */
export const register = async (payload) => {
  const { data } = await api.post(map.register.path, payload);
  return data;
};


export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export default { login, register, me };
