import { Router } from "express";
import * as Auth from "./handler.js";
import { loginValidator, registerValidator } from "./validator.js";
import { auth } from "../../middlewares/auth.js";

const r = Router();

r.post("/auth/login", loginValidator, Auth.login);
r.post("/auth/register", registerValidator, Auth.register);
r.get("/auth/me", auth(), Auth.me);

export default r;
