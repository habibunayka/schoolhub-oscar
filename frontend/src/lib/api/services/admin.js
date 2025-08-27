import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.admin.map((e) => [e.name, e]));

export function takedown(payload) {
  return api.patch(map.takedown.path, payload).then((r) => r.data);
}

export default { takedown };
