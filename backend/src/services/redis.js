import { Queue, Worker } from "bullmq";
import { env } from "../config/env.js";

export const mailQueue = new Queue("mail", {
    connection: { url: env.REDIS_URL },
});
export const imageQueue = new Queue("image", {
    connection: { url: env.REDIS_URL },
});

export function startWorkers() {
    new Worker(
        "mail",
        async (job) => {
            // TODO: kirim email
            return true;
        },
        { connection: { url: env.REDIS_URL } }
    );

    new Worker(
        "image",
        async (job) => {
            // TODO: compress/thumbnail/watermark
            return true;
        },
        { connection: { url: env.REDIS_URL } }
    );
}
