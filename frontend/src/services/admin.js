import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(endpoints.admin.map((e) => [e.name, e]));

/**
 * Takedown an entity
 * @param {{ entity_type:string, entity_id:number }} payload
 * @returns {Promise<object>}
 */
export const takedown = async (payload) => {
  const { data } = await api.patch(map.takedown.path, payload);
  return data;
};

export default { takedown };
