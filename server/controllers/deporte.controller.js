
import mysql from 'mysql2/promise';
import dbConfig from '../config/db.config.js';

export const getDeportes = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM deportes');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeporteById = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM deportes WHERE ID = ?', [req.params.id]);
    await connection.end();
    if (rows.length === 0) {
      res.status(404).json({ error: 'Deporte not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeporte = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { Nombre } = req.body;
    const [result] = await connection.execute('INSERT INTO deportes (Nombre) VALUES (?)', [Nombre]);
    await connection.end();
    res.status(201).json({ id: result.insertId, Nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeporte = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { Nombre } = req.body;
    const [result] = await connection.execute('UPDATE deportes SET Nombre = ? WHERE ID = ?', [Nombre, req.params.id]);
    await connection.end();
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Deporte not found' });
    } else {
      res.json({ id: req.params.id, Nombre });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeporte = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM deportes WHERE ID = ?', [req.params.id]);
    await connection.end();
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Deporte not found' });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};