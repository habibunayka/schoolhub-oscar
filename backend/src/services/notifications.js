import { tx } from "../database/db.js";

export async function sendNotification(userIds, type, payload) {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const payloadStr = JSON.stringify(payload);
    await tx(async ({ run }) => {
        for (const id of ids) {
            await run(
                `INSERT INTO notifications (user_id, type, payload_json) VALUES ($1,$2,$3)`,
                [id, type, payloadStr]
            );
        }
    });
}
