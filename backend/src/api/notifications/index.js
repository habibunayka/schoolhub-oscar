import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import * as Notifications from "./handler.js";
import { validateListNotifications } from "./validator.js";

const r = Router();

r.get(
    "/notifications",
    auth(),
    validateListNotifications,
    Notifications.listNotifications
);

r.post(
    "/notifications/read-all",
    auth(),
    Notifications.markAllRead
);

r.post(
    "/notifications/:id/read",
    auth(),
    Notifications.markNotificationRead
);

export default r;
