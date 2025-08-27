import "dotenv/config";

export const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    S3: {
        ENDPOINT: process.env.S3_ENDPOINT,
        REGION: process.env.S3_REGION,
        BUCKET: process.env.S3_BUCKET,
        ACCESS_KEY: process.env.S3_ACCESS_KEY,
        SECRET_KEY: process.env.S3_SECRET_KEY,
    },
};
