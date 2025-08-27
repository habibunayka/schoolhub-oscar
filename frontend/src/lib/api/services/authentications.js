import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.authentications.map((e) => [e.name, e]));

export function login(payload) {
  return api.post(map.login.path, payload).then((r) => r.data);
}

export function register(payload) {
  return api.post(map.register.path, payload).then((r) => r.data);
}

export default { login, register };
