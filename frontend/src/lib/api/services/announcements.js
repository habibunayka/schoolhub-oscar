import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.announcements.map((e) => [e.name, e]));

export function getAllAnnouncements(params = {}) {
  return api.get(map.getAllAnnouncements.path, { params }).then((r) => r.data);
}

export function getAnnouncementById(id) {
  return api
    .get(map.getAnnouncementById.path.replace(":id", id))
    .then((r) => r.data);
}

export function createAnnouncement(payload) {
  return api.post(map.createAnnouncement.path, payload).then((r) => r.data);
}

export default {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
};
