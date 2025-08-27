import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.posts.map((e) => [e.name, e]));

export function listPosts(clubId) {
  const path = map.listPosts.path.replace(":id", clubId);
  return api.get(path).then((r) => r.data);
}

export function getPostById(clubId, postId) {
  const path = map.getPostById.path
    .replace(":id", clubId)
    .replace(":postId", postId);
  return api.get(path).then((r) => r.data);
}

export function createPost(clubId, payload) {
  const path = map.createPost.path.replace(":id", clubId);
  return api.post(path, payload).then((r) => r.data);
}

export default { listPosts, getPostById, createPost };
