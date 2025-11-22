import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import * as linkSchema from '../models/links.model';

const sslConfig = process.env.DB_SSL === 'true'
    ? { ca: fs.readFileSync(path.join(process.cwd(), 'ca.pem')).toString(), rejectUnauthorized: false }
    : false;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslConfig,
});

export const db = drizzle(pool, { schema: linkSchema });
export { pool };
