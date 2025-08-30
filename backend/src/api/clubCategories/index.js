import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitGlobal } from "../../middlewares/rbac.js";
import * as Categories from "./handler.js";
import {
    validateListCategories,
    validateCreateCategory,
    validatePatchCategory,
    validateGetCategory,
} from "./validator.js";

const r = Router();

r.get("/", validateListCategories, auth(true), Categories.listCategories);

r.post(
    "/",
    validateCreateCategory,
    auth(),
    permitGlobal("school_admin"),
    Categories.createCategory
);

r.patch(
    "/:id",
    validatePatchCategory,
    auth(),
    permitGlobal("school_admin"),
    Categories.patchCategory
);

r.delete(
    "/:id",
    validateGetCategory,
    auth(),
    permitGlobal("school_admin"),
    Categories.deleteCategory
);

export default r;
