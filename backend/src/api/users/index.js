import { Router } from "express";
import path from "path";
import multer from "multer";
import { auth } from "../../middlewares/auth.js";
import * as Users from "./handler.js";

const r = Router();
const upload = multer({ dest: path.join(process.cwd(), "src/uploads") });

r.get("/users/me/stats", auth(), Users.getMyStats);
r.patch("/users/me", auth(), upload.single("avatar"), Users.updateMe);

export default r;
