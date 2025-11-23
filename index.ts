import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './src/config/dbConfig';
import linkRoutes from './src/routes/link.routes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.get('/healthz', (req, res) => res.json({ message: 'URL Shortener API' }));

app.use(cors())
app.use(express.json());

app.use('/api/links', linkRoutes);

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    try {
        const client = await pool.connect();
        console.log('Database connected');
        client.release();
    } catch (err) {
        console.error('Database error:', err);
        process.exit(1);
    }
});
