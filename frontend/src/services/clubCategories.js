import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(
  endpoints.clubCategories.map((e) => [e.name, e])
);

export const listCategories = async (params = {}) => {
  const { data } = await api.get(map.listCategories.path, { params });
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post(map.createCategory.path, payload);
  return data;
};

export const patchCategory = async (id, payload) => {
  const path = map.patchCategory.path.replace(":id", id);
  const { data } = await api.patch(path, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const path = map.deleteCategory.path.replace(":id", id);
  const { data } = await api.delete(path);
  return data;
};

export default {
  listCategories,
  createCategory,
  patchCategory,
  deleteCategory,
};
