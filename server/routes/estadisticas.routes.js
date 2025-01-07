import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estadistica:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *         ID_Jugador:
 *           type: integer
 *         TipoEstadistica:
 *           type: string
 *         Valor:
 *           type: number
 *       required:
 *         - ID_Jugador
 *         - TipoEstadistica
 *         - Valor
 */

/**
 * @swagger
 * /api/estadisticas:
 *   get:
 *     summary: Obtiene todas las estadísticas
 *     tags: [Estadísticas]
 *     responses:
 *       200:
 *         description: Lista de estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estadistica'
 */

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
};

// Get all estadísticas
router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT e.*, j.Nombre as JugadorNombre
            FROM Estadisticas e
            JOIN Jugador j ON e.ID_Jugador = j.ID
        `);
        res.json(rows);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get estadísticas by ID
router.get('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT e.*, j.Nombre as JugadorNombre
            FROM Estadisticas e
            JOIN Jugador j ON e.ID_Jugador = j.ID
            WHERE e.ID = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estadística no encontrada' });
        }

        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get estadísticas by jugador ID
router.get('/jugador/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT e.*, j.Nombre as JugadorNombre
            FROM Estadisticas e
            JOIN Jugador j ON e.ID_Jugador = j.ID
            WHERE e.ID_Jugador = ?
        `, [req.params.id]);
        res.json(rows);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new estadística
router.post('/', async (req, res) => {
    const { ID_Jugador, TipoEstadistica, Valor } = req.body;

    if (!ID_Jugador || !TipoEstadistica || Valor === undefined) {
        return res.status(400).json({ 
            message: 'ID_Jugador, TipoEstadistica y Valor son requeridos' 
        });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`
            INSERT INTO Estadisticas (ID_Jugador, TipoEstadistica, Valor)
            VALUES (?, ?, ?)
        `, [ID_Jugador, TipoEstadistica, Valor]);

        res.status(201).json({
            message: 'Estadística creada exitosamente',
            id: result.insertId
        });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update estadística
router.put('/:id', async (req, res) => {
    const { ID_Jugador, TipoEstadistica, Valor } = req.body;

    if (!ID_Jugador || !TipoEstadistica || Valor === undefined) {
        return res.status(400).json({ 
            message: 'ID_Jugador, TipoEstadistica y Valor son requeridos' 
        });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`
            UPDATE Estadisticas
            SET ID_Jugador = ?, TipoEstadistica = ?, Valor = ?
            WHERE ID = ?
        `, [ID_Jugador, TipoEstadistica, Valor, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estadística no encontrada' });
        }

        res.json({ message: 'Estadística actualizada exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete estadística
router.delete('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM Estadisticas WHERE ID = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estadística no encontrada' });
        }

        res.json({ message: 'Estadística eliminada exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;