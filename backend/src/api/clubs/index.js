import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitGlobal, permitClub } from "../../middlewares/rbac.js";
import * as Clubs from "./handler.js";
import {
    validateListClubs,
    validateCreateClub,
    validatePatchClub,
    validateJoinClub,
    validateSetMemberStatus,
    validateGetClub,
} from "./validator.js";

const r = Router();

r.get("/", validateListClubs, auth(true), Clubs.listClubs);
r.get("/:id", validateGetClub, auth(true), Clubs.getClub);
r.get("/:id/members", validateGetClub, auth(true), Clubs.listMembers);
r.get(
    "/:id/requests",
    validateGetClub,
    auth(),
    permitClub("owner", "admin"),
    Clubs.listRequests
);

r.post(
    "/",
    validateCreateClub,
    auth(),
    permitGlobal("school_admin"),
    Clubs.createClub
);

r.patch(
    "/:id",
    validatePatchClub,
    auth(),
    (req, res, next) => {
        if (req.user.role_global === "school_admin") return next();
        return permitClub("owner", "admin")(req, res, next);
    },
    Clubs.patchClub
);
r.delete(
    "/:id",
    validateGetClub,
    auth(),
    permitGlobal("school_admin"),
    Clubs.deleteClub
);

r.post("/:id/join", validateJoinClub, auth(), Clubs.joinClub);
r.delete("/:id/join", validateJoinClub, auth(), Clubs.leaveClub);

r.patch(
    "/:id/members/:userId",
    validateSetMemberStatus,
    auth(),
    permitClub("owner", "admin"),
    Clubs.setMemberStatus
);

export default r;
