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
  const isFormData = payload instanceof FormData;
  const config = isFormData
    ? {}
    : { headers: { "Content-Type": "application/json" } };
  const { data } = await api.patch(
    "/users/me",
    isFormData ? payload : JSON.stringify(payload),
    config
  );
  return data;
};

export default {
  getUserStats,
  getAchievements,
  updateProfile,
};
