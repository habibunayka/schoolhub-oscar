import api from "./client.js";
import { endpoints } from "./endpoints.js";

const map = Object.fromEntries(endpoints.events.map((e) => [e.name, e]));

/**
 * List events for a club
 * @param {number} clubId
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const listEvents = async (clubId, params = {}) => {
  const path = map.listEvents.path.replace(":id", clubId);
  const { data } = await api.get(path, { params });
  return data;
};

export const getEvent = async (id) => {
  const path = map.getEvent?.path || `/events/${id}`;
  const { data } = await api.get(path.replace(":id", id));
  return data;
};

/**
 * Get upcoming events (currently per club)
 * @param {number} clubId
 * @param {Object} [params]
 * @returns {Promise<object[]>}
 */
export const getUpcomingEvents = async (clubId, params = {}) => {
  return listEvents(clubId, params);
};

/**
 * Create event in club
 * @param {number} clubId
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const createEvent = async (clubId, payload) => {
  const path = map.createEvent.path.replace(":id", clubId);
  const { data } = await api.post(path, payload);
  return data;
};

export const updateEvent = async (id, payload) => {
  const path = map.updateEvent?.path || `/events/${id}`;
  const { data } = await api.put(path.replace(":id", id), payload);
  return data;
};

export const deleteEvent = async (id) => {
  const path = map.deleteEvent?.path || `/events/${id}`;
  const { data } = await api.delete(path.replace(":id", id));
  return data;
};

/**
 * RSVP an event
 * @param {number} id event id
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const rsvpEvent = async (id, payload) => {
  const path = map.rsvpEvent.path.replace(":id", id);
  const { data } = await api.post(path, payload);
  return data;
};

/**
 * Submit review for event
 * @param {number} id event id
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const reviewEvent = async (id, payload) => {
  const path = map.reviewEvent.path.replace(":id", id);
  const { data } = await api.post(path, payload);
  return data;
};

/**
 * Check-in to event
 * @param {number} id event id
 * @param {Object} payload
 * @returns {Promise<object>}
 */
export const checkinEvent = async (id, payload) => {
  const path = map.checkinEvent.path.replace(":id", id);
  const { data } = await api.post(path, payload);
  return data;
};

export const listAllEvents = async (params = {}) => {
  const { data } = await api.get("/events", { params });
  return data;
};

export default {
  listEvents,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  reviewEvent,
  checkinEvent,
  listAllEvents,
  getEvent,
};
