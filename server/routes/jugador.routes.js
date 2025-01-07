import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Jugador:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *         Nombre:
 *           type: string
 *         Posicion:
 *           type: string
 *         Nacionalidad:
 *           type: string
 *         Imagen:
 *           type: string
 *         ID_Equipo:
 *           type: integer
 *         esJugadorActual:
 *           type: boolean
 *         NumeroCamiseta:
 *           type: integer
 *         Edad:
 *           type: integer
 *         Altura:
 *           type: number
 *         Peso:
 *           type: number
 *         Universidad:
 *           type: string
 *         AniosActivos:
 *           type: string
 *         LogroPrincipal:
 *           type: string
 *       required:
 *         - Nombre
 *         - ID_Equipo
 *         - esJugadorActual
 */

/**
 * @swagger
 * /api/jugadores:
 *   get:
 *     summary: Obtiene todos los jugadores
 *     tags: [Jugadores]
 *     responses:
 *       200:
 *         description: Lista de jugadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Jugador'
 */

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
};

// Función auxiliar para validar datos del jugador
const validarDatosJugador = (datos, esCreacion = true) => {
    const errores = [];
    
    if (esCreacion) {
        if (!datos.Nombre) errores.push('El nombre es requerido');
        if (!datos.ID_Equipo) errores.push('El ID del equipo es requerido');
        if (datos.esJugadorActual === undefined) errores.push('Es necesario especificar si es jugador actual');
    }

    if (datos.esJugadorActual) {
        if (!datos.NumeroCamiseta) errores.push('El número de camiseta es requerido');
        if (!datos.Edad) errores.push('La edad es requerida');
    } else {
        if (!datos.AniosActivos) errores.push('Los años activos son requeridos');
    }

    return errores;
};

// GET: Obtener todos los jugadores
router.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                j.*,
                e.Nombre as NombreEquipo,
                e.ID_Deporte,
                ja.NumeroCamiseta,
                ja.Edad,
                ja.Altura,
                ja.Peso,
                ja.Universidad,
                jh.AniosActivos,
                jh.LogroPrincipal,
                CASE 
                    WHEN ja.ID IS NOT NULL THEN 'Actual'
                    WHEN jh.ID IS NOT NULL THEN 'Histórico'
                END as TipoJugador
            FROM Jugador j
            LEFT JOIN Equipo e ON j.ID_Equipo = e.ID
            LEFT JOIN JugadorActual ja ON j.ID = ja.ID
            LEFT JOIN JugadorHistorico jh ON j.ID = jh.ID
            ORDER BY j.Nombre
        `);
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// GET: Obtener jugador por ID
router.get('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                j.*,
                e.Nombre as NombreEquipo,
                e.ID_Deporte,
                ja.NumeroCamiseta,
                ja.Edad,
                ja.Altura,
                ja.Peso,
                ja.Universidad,
                jh.AniosActivos,
                jh.LogroPrincipal,
                CASE 
                    WHEN ja.ID IS NOT NULL THEN 'Actual'
                    WHEN jh.ID IS NOT NULL THEN 'Histórico'
                END as TipoJugador
            FROM Jugador j
            LEFT JOIN Equipo e ON j.ID_Equipo = e.ID
            LEFT JOIN JugadorActual ja ON j.ID = ja.ID
            LEFT JOIN JugadorHistorico jh ON j.ID = jh.ID
            WHERE j.ID = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }
        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        console.error('Error al obtener jugador por ID:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// GET: Obtener jugadores por equipo
router.get('/equipo/:equipoId', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                j.*,
                e.Nombre as NombreEquipo,
                ja.NumeroCamiseta,
                ja.Edad,
                ja.Altura,
                ja.Peso,
                ja.Universidad,
                jh.AniosActivos,
                jh.LogroPrincipal,
                CASE 
                    WHEN ja.ID IS NOT NULL THEN 'Actual'
                    WHEN jh.ID IS NOT NULL THEN 'Histórico'
                END as TipoJugador
            FROM Jugador j
            LEFT JOIN Equipo e ON j.ID_Equipo = e.ID
            LEFT JOIN JugadorActual ja ON j.ID = ja.ID
            LEFT JOIN JugadorHistorico jh ON j.ID = jh.ID
            WHERE j.ID_Equipo = ?
            ORDER BY j.Nombre
        `, [req.params.equipoId]);
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Error al obtener jugadores por equipo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// POST: Crear nuevo jugador
router.post('/', async (req, res) => {
    const errores = validarDatosJugador(req.body);
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    const {
        Nombre, Posicion, Nacionalidad, Imagen, ID_Equipo,
        esJugadorActual, NumeroCamiseta, Edad, Altura, Peso, Universidad,
        AniosActivos, LogroPrincipal
    } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        const [resultJugador] = await connection.execute(`
            INSERT INTO Jugador (Nombre, Posicion, Nacionalidad, Imagen, ID_Equipo)
            VALUES (?, ?, ?, ?, ?)
        `, [Nombre, Posicion, Nacionalidad, Imagen, ID_Equipo]);

        const jugadorId = resultJugador.insertId;

        if (esJugadorActual) {
            await connection.execute(`
                INSERT INTO JugadorActual (ID, NumeroCamiseta, Edad, Altura, Peso, Universidad)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [jugadorId, NumeroCamiseta, Edad, Altura, Peso, Universidad]);
        } else {
            await connection.execute(`
                INSERT INTO JugadorHistorico (ID, AniosActivos, LogroPrincipal)
                VALUES (?, ?, ?)
            `, [jugadorId, AniosActivos, LogroPrincipal]);
        }

        await connection.commit();

        res.status(201).json({ 
            message: 'Jugador creado exitosamente',
            id: jugadorId 
        });
        await connection.end();
    } catch (error) {
        console.error('Error al crear jugador:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// PUT: Actualizar jugador
router.put('/:id', async (req, res) => {
    const errores = validarDatosJugador(req.body, false);
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    const {
        Nombre, Posicion, Nacionalidad, Imagen, ID_Equipo,
        esJugadorActual, NumeroCamiseta, Edad, Altura, Peso, Universidad,
        AniosActivos, LogroPrincipal
    } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        const [resultJugador] = await connection.execute(`
            UPDATE Jugador
            SET Nombre = ?, Posicion = ?, Nacionalidad = ?, Imagen = ?, ID_Equipo = ?
            WHERE ID = ?
        `, [Nombre, Posicion, Nacionalidad, Imagen, ID_Equipo, req.params.id]);

        if (resultJugador.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        if (esJugadorActual) {
            await connection.execute(`
                INSERT INTO JugadorActual (ID, NumeroCamiseta, Edad, Altura, Peso, Universidad)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                NumeroCamiseta = VALUES(NumeroCamiseta),
                Edad = VALUES(Edad),
                Altura = VALUES(Altura),
                Peso = VALUES(Peso),
                Universidad = VALUES(Universidad)
            `, [req.params.id, NumeroCamiseta, Edad, Altura, Peso, Universidad]);
        } else {
            await connection.execute(`
                INSERT INTO JugadorHistorico (ID, AniosActivos, LogroPrincipal)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                AniosActivos = VALUES(AniosActivos),
                LogroPrincipal = VALUES(LogroPrincipal)
            `, [req.params.id, AniosActivos, LogroPrincipal]);
        }

        await connection.commit();

        res.json({ message: 'Jugador actualizado exitosamente' });
        await connection.end();
    } catch (error) {
        console.error('Error al actualizar jugador:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// DELETE: Eliminar jugador
router.delete('/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        const [resultJugador] = await connection.execute('DELETE FROM Jugador WHERE ID = ?', [req.params.id]);

        if (resultJugador.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }

        await connection.execute('DELETE FROM JugadorActual WHERE ID = ?', [req.params.id]);
        await connection.execute('DELETE FROM JugadorHistorico WHERE ID = ?', [req.params.id]);

        await connection.commit();

        res.json({ message: 'Jugador eliminado exitosamente' });
        await connection.end();
    } catch (error) {
        console.error('Error al eliminar jugador:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

export default router;