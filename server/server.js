import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Deportes',
      version: '1.0.0',
      description: 'API para gestión de deportes, equipos, jugadores y estadísticas',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {},
    },
    tags: [
      {
        name: 'Deportes',
        description: 'Operaciones relacionadas con deportes'
      },
      {
        name: 'Equipos',
        description: 'Operaciones relacionadas con equipos'
      },
      {
        name: 'Jugadores',
        description: 'Operaciones relacionadas con jugadores'
      },
      {
        name: 'Estadísticas',
        description: 'Operaciones relacionadas con estadísticas'
      }
    ]
  },
  apis: [
    './routes/*.js'
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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

const startServer = async (retries = 5) => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      if (retries > 0) {
        console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
        process.env.SERVER_PORT = PORT + 1;
        await startServer(retries - 1);
      } else {
        console.error('No available ports found after 5 attempts');
        process.exit(1);
      }
    } else {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  }
};

startServer();

export default app;