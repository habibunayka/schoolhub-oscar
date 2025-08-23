import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitClub } from "../../middlewares/rbac.js";
import * as Events from "./handler.js";
import {
    validateListEvents,
    validateCreateEvent,
    validateRsvpEvent,
    validateCheckinEvent,
} from "./validator.js";

const r = Router();

r.get("/clubs/:id/events", validateListEvents, auth(true), Events.listEvents);

r.post(
    "/clubs/:id/events",
    validateCreateEvent,
    auth(),
    permitClub("owner", "admin"),
    Events.createEvent
);

r.post("/events/:id/rsvp", validateRsvpEvent, auth(), Events.rsvpEvent);

r.post(
    "/events/:id/checkin",
    validateCheckinEvent,
    auth(),
    permitClub("owner", "admin"),
    Events.checkinEvent
);

export default r;
