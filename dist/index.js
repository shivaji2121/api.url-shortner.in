"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const dbConfig_1 = require("./src/config/dbConfig");
const link_routes_1 = __importDefault(require("./src/routes/link.routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.get('/', (req, res) => res.json({ message: 'URL Shortener API' }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/links', link_routes_1.default);
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    try {
        const client = await dbConfig_1.pool.connect();
        console.log('Database connected');
        client.release();
    }
    catch (err) {
        console.error('Database error:', err);
        process.exit(1);
    }
});
