import "dotenv/config";

export const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    S3: {
        ENDPOINT: process.env.S3_ENDPOINT,
        REGION: process.env.S3_REGION,
        BUCKET: process.env.S3_BUCKET,
        ACCESS_KEY: process.env.S3_ACCESS_KEY,
        SECRET_KEY: process.env.S3_SECRET_KEY,
    },
};
