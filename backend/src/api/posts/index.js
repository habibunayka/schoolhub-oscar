import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitClub } from "../../middlewares/rbac.js";
import * as Posts from "./handler.js";
import {
    validateCreatePost,
    validateListPosts,
    validateGetPostById,
} from "./validator.js";

const r = Router();

r.get("/clubs/:id/posts", auth(true), validateListPosts, Posts.listPosts);

r.get(
    "/clubs/:id/posts/:postId",
    auth(true),
    validateGetPostById,
    Posts.getPostById
);

r.post(
    "/clubs/:id/posts",
    auth(),
    permitClub("owner", "admin", "member"),
    validateCreatePost,
    Posts.createPost
);

export default r;
