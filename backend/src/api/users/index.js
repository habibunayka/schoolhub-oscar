import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import * as Users from "./handler.js";

const r = Router();

r.get("/users/me/stats", auth(), Users.getMyStats);

export default r;
