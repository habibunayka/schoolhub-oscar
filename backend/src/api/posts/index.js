import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { permitClub } from "../../middlewares/rbac.js";
import * as Posts from "./handler.js";
import {
    validateCreatePost,
    validateListPosts,
    validateGetPostById,
    validateGetPost,
    validateToggleLike,
    validateListComments,
    validateCreateComment,
} from "./validator.js";
import { upload } from "../../services/storage.js";

const r = Router();

r.get("/clubs/:id/posts", auth(true), validateListPosts, Posts.listPosts);
r.get("/posts/:id", auth(true), validateGetPost, Posts.getPost);

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
    upload.array("images", 10),
    validateCreatePost,
    Posts.createPost
);

r.post("/posts/:id/likes", auth(), validateToggleLike, Posts.likePost);
r.delete("/posts/:id/likes", auth(), validateToggleLike, Posts.unlikePost);
r.get(
    "/posts/:id/comments",
    auth(true),
    validateListComments,
    Posts.listComments
);
r.post(
    "/posts/:id/comments",
    auth(),
    validateCreateComment,
    Posts.createComment
);

export default r;
