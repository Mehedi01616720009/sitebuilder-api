import { Pool, PoolClient } from 'pg';
import config from '../config';
import { Migrations } from './Migrations';

const pool = new Pool({
    host: config.database.host,
    port: parseInt(config.database.port as string),
    database: config.database.dbName,
    user: config.database.user,
    password: config.database.pass,
    max: parseInt(config.database.maxConnection as string),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// connect db
export const DBConnect = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return {
            connected: true,
            message: 'Connected',
        };
    } catch (err) {
        console.error('❌ PostgreSQL connection failed:', err);
        return {
            connected: false,
            message: 'Connection Failed',
            error: err instanceof Error ? err.message : String(err),
        };
    }
};

// table initialize
export const Models = async () => {
    try {
        await pool.query(Migrations.join(''));
        // await pool.query(Post);
    } catch (err) {
        console.error('Error creating tables: ', err);
    }
};

// generic query function
export const Query = async (text: string, params?: unknown[]) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
};

// transaction function
export const withTransaction = async <T>(
    callback: (client: PoolClient) => Promise<T>,
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error transaction: ', err);
    } finally {
        client.release();
    }
};

export default pool;
