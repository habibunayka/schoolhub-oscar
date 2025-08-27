import api from "../client.js";
import { endpoints } from "../endpoints.js";

const map = Object.fromEntries(endpoints.posts.map((e) => [e.name, e]));

/**
 * List posts for a club
 * @param {number} clubId
 * @returns {Promise<object[]>}
 */
export const listPosts = async (clubId) => {
  const path = map.listPosts.path.replace(":id", clubId);
  const { data } = await api.get(path);
  return data;
};

/**
 * Get a post by id
 * @param {number} clubId
 * @param {number} postId
 * @returns {Promise<object>}
 */
export const getPostById = async (clubId, postId) => {
  const path = map.getPostById.path
    .replace(":id", clubId)
    .replace(":postId", postId);
  const { data } = await api.get(path);
  return data;
};

/**
 * Create a post in club
 * @param {number} clubId
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const createPost = async (clubId, payload) => {
  const path = map.createPost.path.replace(":id", clubId);
  const { data } = await api.post(path, payload);
  return data;
};

export default { listPosts, getPostById, createPost };
