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

// Get all deportes
router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM Deporte');
        res.json(rows);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get deporte by ID
router.get('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM Deporte WHERE ID = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Deporte no encontrado' });
        }
        
        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new deporte
router.post('/', async (req, res) => {
    const { Nombre } = req.body;
    
    if (!Nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO Deporte (Nombre) VALUES (?)', [Nombre]);
        
        res.status(201).json({ 
            message: 'Deporte creado exitosamente',
            id: result.insertId
        });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update deporte
router.put('/:id', async (req, res) => {
    const { Nombre } = req.body;
    
    if (!Nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE Deporte SET Nombre = ? WHERE ID = ?', [Nombre, req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Deporte no encontrado' });
        }
        
        res.json({ message: 'Deporte actualizado exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete deporte
router.delete('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM Deporte WHERE ID = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Deporte no encontrado' });
        }
        
        res.json({ message: 'Deporte eliminado exitosamente' });
        await connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;