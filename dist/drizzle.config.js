"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
require("dotenv/config");
const databaseUrl = process.env.DATABASE_URL;
const url = new URL(databaseUrl);
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql', // or other dialect
    dbCredentials: {
        host: url.hostname,
        port: Number(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        ssl: process.env.DB_SSL === 'true',
    },
});
