import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitGlobal } from "../../middlewares/rbac.js";
import * as Admin from "./handler.js";
import { validateTakedown } from "./validator.js";


const r = Router();

r.patch(
    "/admin/takedown",
    auth(),
    permitGlobal("school_admin"),
    validateTakedown,
    Admin.takedown
);

export default r;
