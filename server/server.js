import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Import routes
import deporteRoutes from './routes/deporte.routes.js';
import equipoRoutes from './routes/equipo.routes.js';
import jugadorRoutes from './routes/jugador.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';

// Use routes
app.use('/api/deportes', deporteRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Test database connection
async function testConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log(chalk.green('Database connected successfully'));
        await connection.end();
    } catch (error) {
        console.error(chalk.red('Database connection failed:'), error);
    }
}

testConnection();

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;