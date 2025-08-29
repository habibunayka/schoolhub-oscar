import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(endpoints.announcements.map((e) => [e.name, e]));

/**
 * List announcements
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {number} [options.clubId]
 * @param {string} [options.target]
 * @returns {Promise<object[]>}
 */
export const list = async ({ page = 1, limit = 10, clubId, target } = {}) => {
  const params = { limit, offset: (page - 1) * limit };
  if (clubId) params.club_id = clubId;
  if (target) params.target = target;
  const { data } = await api.get(map.getAllAnnouncements.path, { params });
  return data;
};

/**
 * Get announcement by id
 * @param {number} id
 * @returns {Promise<object>}
 */
export const get = async (id) => {
  const { data } = await api.get(map.getAnnouncementById.path.replace(":id", id));
  return data;
};

/**
 * Create announcement
 * @param {{ club_id:number, title:string, content_html:string, target:string }} payload
 * @returns {Promise<object>}
 */
export const create = async (payload) => {
  const { data } = await api.post(map.createAnnouncement.path, payload);
  return data;
};

/**
 * Update announcement
 * @param {number} id
 * @param {{ title:string, content_html:string, target:string }} payload
 * @returns {Promise<object>}
 */
export const update = async (id, payload) => {
  const { data } = await api.put(map.updateAnnouncement.path.replace(":id", id), payload);
  return data;
};

/**
 * Delete announcement
 * @param {number} id
 * @returns {Promise<object>}
 */
export const remove = async (id) => {
  const { data } = await api.delete(map.deleteAnnouncement.path.replace(":id", id));
  return data;
};

export default { list, get, create, update, remove };
