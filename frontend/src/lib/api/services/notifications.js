import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.notifications.map((e) => [e.name, e]));

export function listNotifications(params = {}) {
  return api.get(map.listNotifications.path, { params }).then((r) => r.data);
}

export default { listNotifications };
