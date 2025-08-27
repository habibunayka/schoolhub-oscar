import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import api from "./api/index.js";
import "./database/db.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve("./uploads")));

app.use("/api", api);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "../uploads")));

app.use((req, res, next) => {
    if (res.headersSent) return next();

    res.setHeader("X-Powered-By", "SchoolHub");

    next();
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;
