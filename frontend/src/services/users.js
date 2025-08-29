import api from "./client.js";

export const getUserStats = async () => {
  const { data } = await api.get("/users/me/stats");
  return data;
};

export const getAchievements = async () => {
  const { data } = await api.get("/achievements");
  return data;
};

export default {
  getUserStats,
  getAchievements,
};
