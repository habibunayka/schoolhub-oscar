import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitClub } from "../../middlewares/rbac.js";
import * as Events from "./handler.js";
import {
    validateListEvents,
    validateGetEvent,
    validateCreateEvent,
    validateUpdateEvent,
    validateRsvpEvent,
    validateCheckinEvent,
    validateReviewEvent,
} from "./validator.js";

const r = Router();

r.get("/events", auth(true), Events.listAllEvents);
r.get("/events/:id", validateGetEvent, auth(true), Events.getEvent);
r.get("/clubs/:id/events", validateListEvents, auth(true), Events.listEvents);

r.post(
    "/clubs/:id/events",
    validateCreateEvent,
    auth(),
    permitClub("owner", "admin"),
    Events.createEvent
);

r.put(
    "/events/:id",
    validateUpdateEvent,
    auth(),
    Events.updateEvent
);

r.post("/events/:id/rsvp", validateRsvpEvent, auth(), Events.rsvpEvent);

r.post("/events/:id/review", validateReviewEvent, auth(), Events.reviewEvent);

r.post(
    "/events/:id/checkin",
    validateCheckinEvent,
    auth(),
    permitClub("owner", "admin"),
    Events.checkinEvent
);

export default r;
