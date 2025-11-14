import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiry: process.env.ACCESS_EXPIRY,
};
