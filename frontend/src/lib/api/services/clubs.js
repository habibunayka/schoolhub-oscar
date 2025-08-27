import api from "../apiClient";
import { endpoints } from "../endpoints";

const map = Object.fromEntries(endpoints.clubs.map((e) => [e.name, e]));

export function listClubs(params = {}) {
  return api.get(map.listClubs.path, { params }).then((r) => r.data);
}

export function createClub(payload) {
  return api.post(map.createClub.path, payload).then((r) => r.data);
}

export function patchClub(id, payload) {
  return api
    .patch(map.patchClub.path.replace(":id", id), payload)
    .then((r) => r.data);
}

export function joinClub(id) {
  return api
    .post(map.joinClub.path.replace(":id", id))
    .then((r) => r.data);
}

export function setMemberStatus(id, userId, payload) {
  return api
    .patch(
      map.setMemberStatus.path.replace(":id", id).replace(":userId", userId),
      payload
    )
    .then((r) => r.data);
}

export default {
  listClubs,
  createClub,
  patchClub,
  joinClub,
  setMemberStatus,
};
