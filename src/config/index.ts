import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
    server: {
        appName: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        baseURL: process.env.BASE_URL,
        allowedOrigin: process.env.CORS_ORIGIN,
    },

    // Database Configuration
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        maxConnection: process.env.DB_MAX_CONNECTION,
    },

    // JWT Configuration
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiry: process.env.ACCESS_EXPIRY,
    },
};
