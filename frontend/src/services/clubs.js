import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(endpoints.clubs.map((e) => [e.name, e]));

/**
 * List clubs
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const listClubs = async (params = {}) => {
  const { data } = await api.get(map.listClubs.path, { params });
  return data;
};

/**
 * Get clubs joined by current user
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const getJoinedClubs = async (params = {}) => {
  return listClubs({ ...params, membership: "joined" });
};

/**
 * Get recommended clubs for user
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const getClubRecommendations = async (params = {}) => {
  return listClubs({ ...params, membership: "recommended" });
};

/**
 * Create a club
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const createClub = async (payload) => {
  const { data } = await api.post(map.createClub.path, payload);
  return data;
};

/**
 * Update club partially
 * @param {number} id
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const patchClub = async (id, payload) => {
  const path = map.patchClub.path.replace(":id", id);
  const { data } = await api.patch(path, payload);
  return data;
};

/**
 * Join a club
 * @param {number} id
 * @returns {Promise<object>}
 */
export const joinClub = async (id) => {
  const path = map.joinClub.path.replace(":id", id);
  const { data } = await api.post(path);
  return data;
};

export const leaveClub = async (id) => {
  const path = map.leaveClub.path.replace(":id", id);
  const { data } = await api.delete(path);
  return data;
};

/**
 * List members of a club
 * @param {number} id club id
 * @returns {Promise<object[]>}
 */
export const listMembers = async (id) => {
  const path = map.listMembers.path.replace(":id", id);
  const { data } = await api.get(path);
  return data;
};

/**
 * Update member status
 * @param {number} id club id
 * @param {number} userId user identifier
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const setMemberStatus = async (id, userId, payload) => {
  const path = map.setMemberStatus.path
    .replace(":id", id)
    .replace(":userId", userId);
  const { data } = await api.patch(path, payload);
  return data;
};

export const getClub = async (id) => {
  const { data } = await api.get(`/clubs/${id}`);
  return data;
};

export default {
  listClubs,
  getJoinedClubs,
  getClubRecommendations,
  createClub,
  patchClub,
  joinClub,
  leaveClub,
  getClub,
  setMemberStatus,
  listMembers,
};
