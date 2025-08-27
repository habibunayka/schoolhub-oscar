import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitClub } from "../../middlewares/rbac.js";
import * as Announcements from "./handler.js";
import {
    validateGetAllAnnouncements,
    validateGetAnnouncementById,
    validateCreateAnnouncement,
    validateUpdateAnnouncement,
    validateDeleteAnnouncement,
} from "./validator.js";

const r = Router();

r.get(
    "/announcements",
    validateGetAllAnnouncements,
    auth(true),
    Announcements.getAllAnnouncements
);

r.get(
    "/announcements/:id",
    validateGetAnnouncementById,
    auth(true),
    Announcements.getAnnouncementById
);

r.post(
    "/announcements",
    validateCreateAnnouncement,
    auth(),
    permitClub("owner", "admin"),
    Announcements.createAnnouncement
);

r.put(
    "/announcements/:id",
    validateUpdateAnnouncement,
    auth(),
    permitClub("owner", "admin"),
    Announcements.updateAnnouncement
);

r.delete(
    "/announcements/:id",
    validateDeleteAnnouncement,
    auth(),
    permitClub("owner", "admin"),
    Announcements.deleteAnnouncement
);

export default r;
