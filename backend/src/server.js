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
import { ValidationError } from "./exceptions/ValidationError.js";

const app = express();
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "SchoolHub");
    next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

app.use("/api", api);

app.get("/health", (req, res) => res.json({ ok: true }));

if (env.NODE_ENV === "test") {
    app.get("/__error", () => {
        throw new Error("test error");
    });
}


app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(422).json({ message: "Validation error", errors: err.errors });
    }

    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

export default app;
