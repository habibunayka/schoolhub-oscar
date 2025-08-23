import app from "./src/server.js";
import { env } from "./src/config/env.js";
import { startWorkers } from "./src/services/redis.js";

app.listen(env.PORT, () => {
    console.log(`🚀 App starting in http://localhost:${env.PORT}`);
    startWorkers();
});