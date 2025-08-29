import api from "./client.js";
import { endpoints } from "./endpoints.js";

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
 * Get posts for feed (currently per club)
 * @param {number} clubId
 * @returns {Promise<object[]>}
 */
export const getFeedPosts = async (clubId) => {
  return listPosts(clubId);
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
 * Get a post by id
 * @param {number} id
 * @returns {Promise<object>}
 */
export const getPost = async (id) => {
  const path = map.getPost?.path || `/posts/${id}`;
  const { data } = await api.get(path.replace(":id", id));
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
  const form = new FormData();
  if (payload?.body_html !== undefined) form.append("body_html", payload.body_html);
  if (payload?.visibility !== undefined) form.append("visibility", payload.visibility);
  if (payload?.pinned !== undefined) form.append("pinned", payload.pinned);
  (payload?.images || []).forEach((img) => form.append("images", img));
  const { data } = await api.post(path, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export default {
  listPosts,
  getFeedPosts,
  getPostById,
  createPost,
  getPost,
};
