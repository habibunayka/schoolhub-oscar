import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve("./uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function presignPut(key, contentType) {
    const filePath = path.join(UPLOAD_DIR, key);

    return {
        uploadPath: filePath,
        url: `/uploads/${key}`, 
        key,
        contentType,
    };
}
