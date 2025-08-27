import api from "../client.js";
import { endpoints } from "../endpoints.js";

const map = Object.fromEntries(endpoints.notifications.map((e) => [e.name, e]));

/**
 * List notifications for current user
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const listNotifications = async (params = {}) => {
  const { data } = await api.get(map.listNotifications.path, { params });
  return data;
};

export default { listNotifications };
