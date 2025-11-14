import { Pool, PoolClient } from 'pg';
import config from '../config';
import { Migrations } from './Migrations';

const pool = new Pool({
    host: config.dbHost,
    port: parseInt(config.dbPort as string),
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPass,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// connect db
export const DBConnect = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    } catch (err) {
        console.error('PostgreSQL connection failed: ', err);
        throw err;
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
