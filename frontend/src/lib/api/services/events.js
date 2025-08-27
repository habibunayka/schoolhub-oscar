import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.events.map((e) => [e.name, e]));

export function listEvents(clubId, params = {}) {
  const path = map.listEvents.path.replace(":id", clubId);
  return api.get(path, { params }).then((r) => r.data);
}

export function createEvent(clubId, payload) {
  const path = map.createEvent.path.replace(":id", clubId);
  return api.post(path, payload).then((r) => r.data);
}

export function rsvpEvent(id, payload) {
  return api
    .post(map.rsvpEvent.path.replace(":id", id), payload)
    .then((r) => r.data);
}

export function reviewEvent(id, payload) {
  return api
    .post(map.reviewEvent.path.replace(":id", id), payload)
    .then((r) => r.data);
}

export function checkinEvent(id, payload) {
  return api
    .post(map.checkinEvent.path.replace(":id", id), payload)
    .then((r) => r.data);
}

export default {
  listEvents,
  createEvent,
  rsvpEvent,
  reviewEvent,
  checkinEvent,
};
