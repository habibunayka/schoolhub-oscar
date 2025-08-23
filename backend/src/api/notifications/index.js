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

export default r;
