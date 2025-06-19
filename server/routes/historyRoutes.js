// server/routes/historyRoutes.js
const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas en este archivo estarán protegidas
router.use(authMiddleware);

// RUTA: GET /api/history -> Obtiene el historial del usuario logueado
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit || 20; 
        const history = await db.query(
            'SELECT * FROM search_history WHERE user_id = $1 ORDER BY search_timestamp DESC LIMIT $2',
            [req.user.id, limit]
        );
        res.json(history.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// RUTA: POST /api/history -> Guarda un nuevo registro de búsqueda
router.post('/', async (req, res) => {
    const { dni_consultado, nombre_completo } = req.body;

    if (!dni_consultado || !nombre_completo) {
        return res.status(400).json({ message: 'Datos de historial incompletos.' });
    }

    try {
        await db.query(
            'INSERT INTO search_history (user_id, dni_consultado, nombre_completo) VALUES ($1, $2, $3)',
            [req.user.id, dni_consultado, nombre_completo]
        );
        res.status(201).json({ message: 'Historial guardado con éxito.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.delete('/', async (req, res) => {
    try {
        await db.query('DELETE FROM search_history WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'El historial ha sido eliminado.' });
    } catch (error) {
        console.error('Error al limpiar el historial:', error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;