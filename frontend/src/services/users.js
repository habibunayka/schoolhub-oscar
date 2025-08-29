import api from "./client.js";

export const getUserStats = async () => {
  const { data } = await api.get("/users/me/stats");
  return data;
};

export const getAchievements = async () => {
  const { data } = await api.get("/achievements");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/users/me", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export default {
  getUserStats,
  getAchievements,
  updateProfile,
};
