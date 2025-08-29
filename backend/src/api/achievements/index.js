import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import * as Achievements from "./handler.js";
import { validateCreateAchievement } from "./validator.js";

const r = Router();

r.get("/achievements", auth(), Achievements.getMyAchievements);
r.post("/achievements", auth(), validateCreateAchievement, Achievements.createAchievement);

export default r;
