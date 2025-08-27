import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.announcements.map((e) => [e.name, e]));

export function list({ page = 1, limit = 10, clubId, target } = {}) {
  const params = { limit, offset: (page - 1) * limit };
  if (clubId) params.club_id = clubId;
  if (target) params.target = target;
  return api
    .get(map.getAllAnnouncements.path, { params })
    .then((r) => r.data);
}

export function get(id) {
  return api
    .get(map.getAnnouncementById.path.replace(":id", id))
    .then((r) => r.data);
}

export function create(payload) {
  return api.post(map.createAnnouncement.path, payload).then((r) => r.data);
}

export function update(id, payload) {
  return api
    .put(map.updateAnnouncement.path.replace(":id", id), payload)
    .then((r) => r.data);
}

export function remove(id) {
  return api
    .delete(map.deleteAnnouncement.path.replace(":id", id))
    .then((r) => r.data);
}

export default { list, get, create, update, remove };
