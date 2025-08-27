import { Router } from "express";

import authRoutes from "./authentications/index.js";
import clubRoutes from "./clubs/index.js";
import eventRoutes from "./events/index.js";
import postRoutes from "./posts/index.js";
import announcementRoutes from "./announcements/index.js";
import notificationRoutes from "./notifications/index.js";
import adminRoutes from "./admin/index.js";

const r = Router();

r.use(authRoutes);
r.use("/clubs", clubRoutes);
r.use(eventRoutes);
r.use(postRoutes);
r.use(announcementRoutes);
r.use(notificationRoutes);
r.use(adminRoutes);

export default r;
