import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
};

// Get all equipos
router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT e.*, d.Nombre as DeporteNombre 
            FROM Equipo e
            JOIN Deporte d ON e.ID_Deporte = d.ID
        `);
        res.json(rows);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get equipo by ID
router.get('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT e.*, d.Nombre as DeporteNombre 
            FROM Equipo e
            JOIN Deporte d ON e.ID_Deporte = d.ID
            WHERE e.ID = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }
        
        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new equipo
router.post('/', async (req, res) => {
    const { 
        Nombre, 
        Logo, 
        Pais, 
        Ciudad, 
        EstadioArena, 
        AnioFundacion, 
        NumeroCampeonatos, 
        ID_Deporte 
    } = req.body;

    if (!Nombre || !ID_Deporte) {
        return res.status(400).json({ 
            message: 'Nombre y ID_Deporte son requeridos' 
        });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`
            INSERT INTO Equipo (
                Nombre, Logo, Pais, Ciudad, EstadioArena, 
                AnioFundacion, NumeroCampeonatos, ID_Deporte
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [Nombre, Logo, Pais, Ciudad, EstadioArena, AnioFundacion, NumeroCampeonatos, ID_Deporte]);
        
        res.status(201).json({ 
            message: 'Equipo creado exitosamente',
            id: result.insertId
        });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update equipo
router.put('/:id', async (req, res) => {
    const { 
        Nombre, 
        Logo, 
        Pais, 
        Ciudad, 
        EstadioArena, 
        AnioFundacion, 
        NumeroCampeonatos, 
        ID_Deporte 
    } = req.body;

    if (!Nombre || !ID_Deporte) {
        return res.status(400).json({ 
            message: 'Nombre y ID_Deporte son requeridos' 
        });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`
            UPDATE Equipo 
            SET Nombre = ?, Logo = ?, Pais = ?, Ciudad = ?, EstadioArena = ?, 
                AnioFundacion = ?, NumeroCampeonatos = ?, ID_Deporte = ?
            WHERE ID = ?
        `, [Nombre, Logo, Pais, Ciudad, EstadioArena, AnioFundacion, NumeroCampeonatos, ID_Deporte, req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }
        
        res.json({ message: 'Equipo actualizado exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete equipo
router.delete('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM Equipo WHERE ID = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }
        
        res.json({ message: 'Equipo eliminado exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;