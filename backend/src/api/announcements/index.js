import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitGlobal } from "../../middlewares/rbac.js";
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
    Announcements.getAllAnnouncements
);

r.get(
    "/announcements/:id",
    validateGetAnnouncementById,
    Announcements.getAnnouncementById
);

r.post(
    "/announcements",
    validateCreateAnnouncement,
    auth(),
    permitGlobal("school_admin"),
    Announcements.createAnnouncement
);

r.put(
    "/announcements/:id",
    validateUpdateAnnouncement,
    auth(),
    permitGlobal("school_admin"),
    Announcements.updateAnnouncement
);

r.delete(
    "/announcements/:id",
    validateDeleteAnnouncement,
    auth(),
    permitGlobal("school_admin"),
    Announcements.deleteAnnouncement
);

export default r;
